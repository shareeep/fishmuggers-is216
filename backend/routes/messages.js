// routes/messages.js
const express = require("express");
const { db } = require("../services/firebase"); // Import Firestore instance
const router = express.Router();

// Route to send a new message
router.post("/send", async (req, res) => {
  const { senderUid, receiverUid, messageText } = req.body;

  if (!senderUid || !receiverUid || !messageText) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newMessage = {
      senderUid,
      receiverUid,
      messageText,
      timestamp: new Date(),
    };

    const messageRef = await db.collection("messages").add(newMessage);

    res.status(200).json({
      message: "Message sent successfully!",
      messageId: messageRef.id,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});


// Route to get all messages involving a specific user (either as sender or receiver)
router.get("/user/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    // Fetch messages where the user is the sender
    const sentMessagesPromise = db
      .collection("messages")
      .where("senderUid", "==", uid)
      .get();

    // Fetch messages where the user is the receiver
    const receivedMessagesPromise = db
      .collection("messages")
      .where("receiverUid", "==", uid)
      .get();

    // Await both queries in parallel
    const [sentMessagesSnapshot, receivedMessagesSnapshot] = await Promise.all([sentMessagesPromise, receivedMessagesPromise]);

    const messages = [];

    // Process sent messages
    sentMessagesSnapshot.forEach((doc) => {
      const messageData = doc.data();
      const message = {
        id: doc.id,
        ...messageData,
        timestamp: new Date(messageData.timestamp._seconds * 1000), // Convert Firestore timestamp to JS Date
      };
      messages.push(message);
    });

    // Process received messages
    receivedMessagesSnapshot.forEach((doc) => {
      const messageData = doc.data();
      const message = {
        id: doc.id,
        ...messageData,
        timestamp: new Date(messageData.timestamp._seconds * 1000), // Convert Firestore timestamp to JS Date
      };
      messages.push(message);
    });

    // Sort all messages by timestamp (ascending order)
    messages.sort((a, b) => a.timestamp - b.timestamp);

    // Format messages by conversation
    const formatMessages = (uid, messages) => {
      // Group messages by the other person (either senderUid or receiverUid that isn't you)
      const conversations = {};
    
      messages.forEach((message) => {
        const otherPersonUid = message.senderUid === uid ? message.receiverUid : message.senderUid;
    
        // If there's no conversation with this person yet, initialize it
        if (!conversations[otherPersonUid]) {
          conversations[otherPersonUid] = {
            senderUid: otherPersonUid,
            lastMessage: '',
            latest: null,
            messages: [],
          };
        }
    
        // Add message to the conversation
        conversations[otherPersonUid].messages.push({
          text: message.messageText,
          sentByYou: message.senderUid === uid, // true if you are the sender
        });
    
        // Update lastMessage and latest if this message is the most recent
        const messageTimestamp = new Date(message.timestamp);
        if (!conversations[otherPersonUid].latest || messageTimestamp > new Date(conversations[otherPersonUid].latest)) {
          conversations[otherPersonUid].lastMessage = message.messageText;
          conversations[otherPersonUid].latest = messageTimestamp;
        }
      });
    
      // Sort messages within each conversation by timestamp
      Object.keys(conversations).forEach((personUid) => {
        conversations[personUid].messages.sort((a, b) => {
          const timestampA = new Date(a.timestamp);
          const timestampB = new Date(b.timestamp);
          return timestampA - timestampB;
        });
      });
    
      // Convert conversations object to an array
      return Object.values(conversations);
    };

    const formattedConversations = formatMessages(uid, messages);

    // Function to append user details to conversations
    const appendUserDetailsToMessages = async (conversations) => {
      // Loop through each conversation and fetch user details for the senderUid
      for (const conversation of conversations) {
        const senderUid = conversation.senderUid;
    
        try {
          // Query the users collection to get the user details for senderUid
          const userDoc = await db.collection('users').doc(senderUid).get();
    
          if (userDoc.exists) {
            const userData = userDoc.data();
    
            // Append username and profileImage to the conversation
            conversation.name = userData.username || 'Unknown User';
            conversation.avatar = userData.profileImage || '';
          } else {
            // In case user data is not found, set default values
            conversation.name = 'Unknown User';
            conversation.avatar = '';
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Handle the error by setting default values
          conversation.username = 'Unknown User';
          conversation.profileImage = '';
        }
      }
    
      return conversations; // Return updated conversations array
    };
    
    const updatedConversations = await appendUserDetailsToMessages(formattedConversations);

    res.status(200).json(updatedConversations);
  } catch (error) {
    console.error("Error retrieving messages for user:", error);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});



module.exports = router;
