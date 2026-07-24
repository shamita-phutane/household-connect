package com.backend.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.services.entity.Services;
@Repository
public interface ServicesRepository extends JpaRepository<Services,Long> {

}
	