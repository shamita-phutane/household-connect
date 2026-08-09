USE householdconnect_db;

DELETE FROM user_subscriptions;
DELETE FROM subscription_plans;

INSERT INTO subscription_plans (plan_name, price, discount, description) VALUES
('Basic', 299.0, 5.0, '5% discount on bookings,Up to 2 discounted bookings per month,24hr free cancellation'),
('Pro', 599.0, 10.0, '10% discount on bookings,Up to 5 discounted bookings per month,12hr free cancellation,Priority booking'),
('Elite', 999.0, 15.0, '15% discount on bookings,Unlimited discounted bookings,6hr free cancellation,Priority booking,Dedicated customer support');
