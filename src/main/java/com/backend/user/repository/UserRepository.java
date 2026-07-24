package com.backend.user.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.user.entity.User;
@Repository
public interface UserRepository extends JpaRepository<User, Long>  {

	  Optional<User> findByEmail(String email);
	  Optional<User> findByPhone(String phone);
	  boolean existsByPhone(String phone);
	  boolean existsByEmail(String email);
}
