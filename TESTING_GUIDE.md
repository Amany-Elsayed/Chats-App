# Chat Application Testing Guide

## How to Properly Test the Chat Functionality

### Important: Testing with Two Accounts

When testing chat functionality between two users, you **MUST** use **separate browser instances** to avoid conflicts. Here's why and how:

### **DON'T DO THIS:**
- Opening two tabs in the same browser window
- Using the same browser profile for both accounts
- Testing both accounts in the same browser session

**Why?** The browser shares:
- `localStorage` (where tokens are stored)
- Socket connections can conflict
- Session data gets mixed up

### **DO THIS INSTEAD:**

#### **Option 1: Different Browsers (Recommended)**
1. **Browser 1**: Open Chrome and log in as **User A**
   - Register/Login with account: `user1@example.com`
   - Navigate to `/chat`
   
2. **Browser 2**: Open Firefox (or Edge) and log in as **User B**
   - Register/Login with account: `user2@example.com`
   - Navigate to `/chat`

3. **Test the chat:**
   - In Browser 1 (User A): Select User B from the user list
   - Send a message: "Hello from User A"
   - In Browser 2 (User B): You should see the message appear
   - In Browser 2 (User B): Select User A and reply: "Hi from User B"
   - In Browser 1 (User A): You should see the reply

#### **Option 2: Incognito/Private Windows**
1. **Window 1**: Open a regular browser window
   - Log in as **User A**
   - Navigate to `/chat`

2. **Window 2**: Open an **Incognito/Private** window (Ctrl+Shift+N in Chrome, Ctrl+Shift+P in Firefox)
   - Log in as **User B**
   - Navigate to `/chat`

3. **Test the chat** as described above

#### **Option 3: Different Browser Profiles**
1. Create separate browser profiles in Chrome:
   - Profile 1: User A
   - Profile 2: User B
2. Open each profile in separate windows
3. Test as described above

### **Step-by-Step Testing Checklist**

1. **Setup:**
   - [ ] Start the backend server (`cd server && npm start`)
   - [ ] Start the frontend (`cd client && npm start`)
   - [ ] Open two different browsers/incognito windows

2. **Register/Login:**
   - [ ] Browser 1: Register User A (e.g., `alice@test.com`, password: `password123`)
   - [ ] Browser 2: Register User B (e.g., `bob@test.com`, password: `password123`)
   - [ ] Both should be redirected to `/chat` after login

3. **Verify Connection:**
   - [ ] Browser 1: Check that User B appears in the user list
   - [ ] Browser 2: Check that User A appears in the user list
   - [ ] Check browser console for "Socket connected" messages (no errors)

4. **Test Sending Messages:**
   - [ ] Browser 1: Click on User B in the user list
   - [ ] Browser 1: Type a message and click Send
   - [ ] Browser 1: Message should appear in **blue box** (right-aligned)
   - [ ] Browser 2: Message should appear in **grey box** (left-aligned)
   - [ ] Browser 2: Click on User A in the user list
   - [ ] Browser 2: Type a reply and click Send
   - [ ] Browser 2: Reply should appear in **blue box**
   - [ ] Browser 1: Reply should appear in **grey box**

5. **Test Real-time Updates:**
   - [ ] Send messages without refreshing the page
   - [ ] Messages should appear instantly on both sides
   - [ ] No need to reload the page

### **Debugging Tips**

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for socket connection messages
   - Check for any JavaScript errors

2. **Check Server Logs:**
   - Look for "Socket connected: [userId]" messages
   - Check for any error messages

3. **Network Tab:**
   - Check WebSocket connections in Network tab
   - Verify socket.io connections are established

### **Expected Behavior**

- Your own messages: **Blue box, right-aligned**
- Other user's messages: **Grey box, left-aligned**
- Messages appear instantly without page refresh
- Messages persist when you reload the page (loaded from database)
- Only messages between selected users are shown

---

**Remember:** Always use separate browser instances when testing with multiple accounts!
