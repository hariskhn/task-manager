# Quick Start Guide

## Prerequisites Check

- ✅ Node.js installed (check with `node --version`)
- ✅ MongoDB installed and running (check with `mongod --version`)
- ✅ npm or yarn installed
- ✅ Expo CLI installed globally: `npm install -g expo-cli`

## Step-by-Step Setup

### 1. Start MongoDB

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Or run: mongod
```

**Mac/Linux:**
```bash
mongod
```

### 2. Start Backend Server

```bash
cd backend
npm install
npm start
```

You should see: `Server running on port 3000` and `MongoDB Connected`

### 3. Start Frontend (in a new terminal)

```bash
cd frontend
npm install
npm start
```

### 4. Run the App

- **Android Emulator**: Press `a` in the Expo terminal
- **iOS Simulator**: Press `i` in the Expo terminal (Mac only)
- **Physical Device**: 
  - Install Expo Go app from App Store/Play Store
  - Scan the QR code shown in terminal
  - **Important**: Update API URL in `frontend/src/config/api.js` to your computer's IP address

### 5. Update API URL for Physical Devices

If testing on a physical device, update `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000/api';
```

Find your IP:
- **Windows**: `ipconfig` (look for IPv4 Address)
- **Mac/Linux**: `ifconfig` or `ip addr`

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Check if port 3000 is available
- Verify `.env` file exists in backend folder

### Frontend can't connect to backend
- Ensure backend is running on port 3000
- For physical devices, use your computer's IP address, not `localhost`
- Check firewall settings

### Date picker not working
- Make sure `@react-native-community/datetimepicker` is installed
- Run `npm install` again in frontend folder

## Testing the App

1. Tap the **+** button to create a task
2. Fill in task details and save
3. Tap a task to view details
4. Use the filter icon to filter tasks
5. Use search bar to search tasks
6. Tap checkbox to mark task as complete

Enjoy your task manager! 🎉

