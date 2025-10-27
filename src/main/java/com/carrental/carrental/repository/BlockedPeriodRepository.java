package com.carrental.carrental.repository;

import com.carrental.carrental.model.BlockedPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BlockedPeriodRepository extends JpaRepository<BlockedPeriod, Long> {

    List<BlockedPeriod> findByVehicleId(Long vehicleId);

    @Query("SELECT bp FROM BlockedPeriod bp WHERE bp.vehicleId = :vehicleId AND " +
            "((bp.startDate <= :endDate AND bp.endDate >= :startDate))")
    List<BlockedPeriod> findOverlappingBlocks(@Param("vehicleId") Long vehicleId,
                                              @Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);

    List<BlockedPeriod> findByEndDateAfter(LocalDate date);

    void deleteByVehicleId(Long vehicleId);

    @Query("SELECT bp FROM BlockedPeriod bp WHERE bp.endDate >= CURRENT_DATE ORDER BY bp.startDate")
    List<BlockedPeriod> findActiveBlocks();
}