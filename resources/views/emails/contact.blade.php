<!DOCTYPE html>
<html>
<head>
    <title>Contact Form Submission</title>
</head>
<body>
    <h1>Contact Form Submission</h1>
    <p><strong>Name:</strong> {{ $contact['fullname'] }}</p>
    <p><strong>Email:</strong> {{ $contact['email'] }}</p>
    <p><strong>Phone Number:</strong> {{ $contact['phone_number'] }}</p>
    <p><strong>Message:</strong> {{ $contact['message'] }}</p>
</body>
</html>
