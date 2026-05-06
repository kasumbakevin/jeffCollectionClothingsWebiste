const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const messagesFile = path.join(__dirname, 'messages.json');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  const newMessage = {
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : '',
    subject: subject.trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString()
  };

  try {
    let messages = [];
    if (fs.existsSync(messagesFile)) {
      const fileData = await fs.promises.readFile(messagesFile, 'utf8');
      messages = fileData ? JSON.parse(fileData) : [];
    }

    messages.push(newMessage);
    await fs.promises.writeFile(messagesFile, JSON.stringify(messages, null, 2), 'utf8');

    console.log('New contact message saved:', newMessage);
    return res.json({ success: true, message: 'Thank you! Your message has been received.' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.listen(PORT, () => {
  console.log(`Jeff Clothings server is running at http://localhost:${PORT}`);
});
