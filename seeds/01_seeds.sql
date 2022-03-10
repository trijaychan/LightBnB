INSERT INTO users (name, email, password)
VALUES ('User 1', 'user1@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('User 2', 'user1@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('User 3', 'user1@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, country, street, city, province, post_code)
VALUES (1, 'Beachhouse', 'description', 'thumbnail1.com', 'cover1.com', 'United States', 'Beach Street', 'Santa Monica', 'California', 'Code 1'),
(2, 'Duplex', 'description', 'thumbnail2.com', 'cover2.com', 'Canada', 'Surrey Street', 'Surrey', 'British Columbia', 'Code 2'),
(3, 'Penthouse', 'description', 'thumbnail3.com', 'cover3.com', 'Canada', 'Downtown', 'Vancouver', 'British Columbia', 'Code 3');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 3, 'mid'),
(2, 2, 2, 3, 'alright'),
(3, 3, 3, 5, 'insane');