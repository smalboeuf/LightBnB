INSERT INTO users (id,name, email, password) 
VALUES (1, 'Michelle Chelser', 'mchelser@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(2, 'Jim Pickens', 'chunky123@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3, 'Freddy Jacobs', 'thatBoyFreddy@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms,number_of_bedrooms, country, street, city, province, post_code, active) 
VALUES (1, 'Nice house', 'description', 'thumbnail_url', 'cover_photo_url', 25, 2, 2, 2, 'Canada', 'Easy', 'Montreal', 'Quebec', 'H8SN2S', TRUE),
(2,'Fancy Apartment', 'description', 'thumbnail_url', 'cover_photo_url', 30, 1, 2, 3,'Canada', 'Breezy', 'Ste Anne de Bellevue', 'Quebec', 'H9SN2S', TRUE),
(2, 'Big Barn', 'description', 'thumbnail_url', 'cover_photo_url', 20, 1, 2, 1,'Canada', 'Crazy', 'Montreal', 'Quebec', 'F2SN2F', FALSE);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
VALUES (1, 2, 19, 4, 'message'),
(1, 1, 20, 3, 'message'),
(2, 1, 21, 5, 'message');

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');