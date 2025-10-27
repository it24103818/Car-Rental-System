package com.carrental.carrental.service;

import com.carrental.carrental.dto.*;
import com.carrental.carrental.model.BlockedPeriod;
import com.carrental.carrental.model.Vehicle;
import com.carrental.carrental.model.Booking;
import com.carrental.carrental.enums.VehicleStatus;
import com.carrental.carrental.repository.BlockedPeriodRepository;
import com.carrental.carrental.repository.VehicleRepository;
import com.carrental.carrental.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AvailabilityService {

    private final VehicleRepository vehicleRepository;
    private final BlockedPeriodRepository blockedPeriodRepository;
    private final BookingRepository bookingRepository;

    public AvailabilityService(VehicleRepository vehicleRepository,
                               BlockedPeriodRepository blockedPeriodRepository,
                               BookingRepository bookingRepository) {
        this.vehicleRepository = vehicleRepository;
        this.blockedPeriodRepository = blockedPeriodRepository;
        this.bookingRepository = bookingRepository;
    }

    public AvailabilityStatsDTO getAvailabilityStats() {
        List<Vehicle> allVehicles = vehicleRepository.findAll();

        long total = allVehicles.size();
        long available = allVehicles.stream().filter(v -> VehicleStatus.AVAILABLE.equals(v.getStatus())).count();
        long booked = allVehicles.stream().filter(v -> VehicleStatus.RENTED.equals(v.getStatus())).count();
        long maintenance = allVehicles.stream().filter(v -> VehicleStatus.MAINTENANCE.equals(v.getStatus())).count();
        long blocked = blockedPeriodRepository.findActiveBlocks().size();

        return new AvailabilityStatsDTO(total, available, booked, maintenance, blocked);
    }

    public List<VehicleAvailabilityDTO> getAllVehiclesWithAvailability() {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        return vehicles.stream().map(vehicle -> {
            VehicleAvailabilityDTO dto = new VehicleAvailabilityDTO();
            dto.setId(vehicle.getId());
            dto.setMake(vehicle.getMake());
            dto.setModel(vehicle.getModel());
            dto.setYear(vehicle.getYear());
            dto.setLicensePlate(vehicle.getLicensePlate());
            dto.setStatus(vehicle.getStatus());

            // Get current active booking
            List<Booking> activeBookings = bookingRepository.findByVehicle_Id(vehicle.getId())
                    .stream()
                    .filter(booking -> "ACTIVE".equals(booking.getBookingStatus()))
                    .collect(Collectors.toList());

            if (!activeBookings.isEmpty()) {
                Booking currentBooking = activeBookings.get(0);
                CurrentBookingDTO bookingDTO = new CurrentBookingDTO();
                bookingDTO.setCustomer(currentBooking.getCustomerName());
                bookingDTO.setStartDate(currentBooking.getPickupDate());
                bookingDTO.setEndDate(currentBooking.getReturnDate());
                dto.setCurrentBooking(bookingDTO);
                dto.setNextAvailable(currentBooking.getReturnDate().plusDays(1));
            } else {
                // Check for blocked periods
                List<BlockedPeriod> activeBlocks = blockedPeriodRepository.findByVehicleId(vehicle.getId())
                        .stream()
                        .filter(block -> block.getEndDate().isAfter(LocalDate.now()))
                        .collect(Collectors.toList());

                if (!activeBlocks.isEmpty()) {
                    BlockedPeriod nextBlock = activeBlocks.get(0);
                    dto.setNextAvailable(nextBlock.getEndDate().plusDays(1));
                } else {
                    dto.setNextAvailable(LocalDate.now());
                }
            }

            return dto;
        }).collect(Collectors.toList());
    }

    public List<BlockedPeriodDTO> getAllBlockedPeriods() {
        List<BlockedPeriod> blockedPeriods = blockedPeriodRepository.findActiveBlocks();

        return blockedPeriods.stream().map(block -> {
            BlockedPeriodDTO dto = new BlockedPeriodDTO();
            dto.setId(block.getId());
            dto.setVehicleId(block.getVehicleId());
            dto.setStartDate(block.getStartDate());
            dto.setEndDate(block.getEndDate());
            dto.setReason(block.getReason());
            dto.setCreatedDate(block.getCreatedDate());

            // Get vehicle description
            Vehicle vehicle = vehicleRepository.findById(block.getVehicleId()).orElse(null);
            if (vehicle != null) {
                dto.setVehicleDescription(vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    public BlockedPeriod blockVehicle(BlockVehicleRequest request) {
        // Check for overlapping blocks
        List<BlockedPeriod> overlappingBlocks = blockedPeriodRepository.findOverlappingBlocks(
                request.getVehicleId(), request.getStartDate(), request.getEndDate());

        if (!overlappingBlocks.isEmpty()) {
            throw new IllegalArgumentException("Vehicle is already blocked for the selected period");
        }

        // Check for existing bookings in the period
        List<Booking> overlappingBookings = bookingRepository.findByVehicle_Id(request.getVehicleId())
                .stream()
                .filter(booking -> isDateRangeOverlapping(
                        booking.getPickupDate(), booking.getReturnDate(),
                        request.getStartDate(), request.getEndDate()))
                .collect(Collectors.toList());

        if (!overlappingBookings.isEmpty()) {
            throw new IllegalArgumentException("Vehicle has bookings during the selected period");
        }

        BlockedPeriod blockedPeriod = new BlockedPeriod();
        blockedPeriod.setVehicleId(request.getVehicleId());
        blockedPeriod.setStartDate(request.getStartDate());
        blockedPeriod.setEndDate(request.getEndDate());
        blockedPeriod.setReason(request.getReason());

        return blockedPeriodRepository.save(blockedPeriod);
    }

    public void unblockVehicle(Long vehicleId) {
        blockedPeriodRepository.deleteByVehicleId(vehicleId);
    }

    public void unblockPeriod(Long blockId) {
        blockedPeriodRepository.deleteById(blockId);
    }

    public boolean isVehicleAvailable(Long vehicleId, LocalDate startDate, LocalDate endDate) {
        // Check if vehicle exists and is not under maintenance
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        if (VehicleStatus.MAINTENANCE.equals(vehicle.getStatus())) {
            return false;
        }

        // Check for overlapping blocks
        List<BlockedPeriod> overlappingBlocks = blockedPeriodRepository.findOverlappingBlocks(
                vehicleId, startDate, endDate);

        if (!overlappingBlocks.isEmpty()) {
            return false;
        }

        // Check for overlapping bookings
        List<Booking> overlappingBookings = bookingRepository.findByVehicle_Id(vehicleId)
                .stream()
                .filter(booking -> "ACTIVE".equals(booking.getBookingStatus()))
                .filter(booking -> isDateRangeOverlapping(
                        booking.getPickupDate(), booking.getReturnDate(), startDate, endDate))
                .collect(Collectors.toList());

        return overlappingBookings.isEmpty();
    }

    private boolean isDateRangeOverlapping(LocalDate start1, LocalDate end1, LocalDate start2, LocalDate end2) {
        return start1.isBefore(end2) && end1.isAfter(start2);
    }
}