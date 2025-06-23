#!/usr/bin/env python3
import requests
import json
import time
import uuid
from datetime import datetime
import os

# Get the backend URL from environment variable
BACKEND_URL = "https://28190b09-c4a1-4427-a8ee-4c6938ed4365.preview.emergentagent.com/api"

class MedAgentBackendTest:
    def __init__(self):
        self.session_id = None
        self.test_results = {}
        
    def run_all_tests(self):
        """Run all backend tests in sequence"""
        print("Starting MedAgent Backend Tests...")
        
        # 1. Test API Health Check
        self.test_health_check()
        
        # 2. Test Chat Session Management
        self.test_create_session()
        self.test_get_session()
        
        # 3. Test User Profile Management
        self.test_create_profile()
        self.test_get_profile()
        
        # 4. Test Gemini AI Integration
        self.test_welcome_message()
        self.test_chat_conversation()
        
        # 5. Test Multi-turn Conversation
        self.test_conversation_history()
        
        # 6. Test Session Summary
        self.test_session_summary()
        
        # 7. Test Close Session
        self.test_close_session()
        
        # Print summary of test results
        self.print_test_summary()
        
    def test_health_check(self):
        """Test the health check endpoint"""
        print("\n=== Testing Health Check API ===")
        try:
            print(f"Making request to: {BACKEND_URL}/health")
            response = requests.get(f"{BACKEND_URL}/health")
            print(f"Raw response: {response.text}")
            data = response.json()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            assert response.status_code == 200, "Health check failed with non-200 status code"
            assert data["status"] == "healthy", "Health check returned unhealthy status"
            assert data["database"] == "connected", "Database connection failed"
            assert data["ai_service"] == "configured", "Gemini API not configured"
            
            self.test_results["health_check"] = True
            print("✅ Health Check Test: PASSED")
        except Exception as e:
            self.test_results["health_check"] = False
            print(f"❌ Health Check Test: FAILED - {str(e)}")
    
    def test_create_session(self):
        """Test creating a new chat session"""
        print("\n=== Testing Create Chat Session ===")
        try:
            response = requests.post(
                f"{BACKEND_URL}/chat/session",
                json={}
            )
            data = response.json()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            assert response.status_code == 200, "Create session failed with non-200 status code"
            assert "session_id" in data, "Session ID not found in response"
            assert data["status"] == "active", "Session not marked as active"
            
            # Save session ID for subsequent tests
            self.session_id = data["session_id"]
            print(f"Created session with ID: {self.session_id}")
            
            self.test_results["create_session"] = True
            print("✅ Create Session Test: PASSED")
        except Exception as e:
            self.test_results["create_session"] = False
            print(f"❌ Create Session Test: FAILED - {str(e)}")
    
    def test_get_session(self):
        """Test retrieving an existing chat session"""
        print("\n=== Testing Get Chat Session ===")
        try:
            if not self.session_id:
                raise Exception("No session ID available. Create session test must pass first.")
                
            response = requests.get(f"{BACKEND_URL}/chat/session/{self.session_id}")
            data = response.json()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            assert response.status_code == 200, "Get session failed with non-200 status code"
            assert data["session_id"] == self.session_id, "Session ID mismatch"
            assert data["status"] == "active", "Session not marked as active"
            
            self.test_results["get_session"] = True
            print("✅ Get Session Test: PASSED")
        except Exception as e:
            self.test_results["get_session"] = False
            print(f"❌ Get Session Test: FAILED - {str(e)}")
    
    def test_create_profile(self):
        """Test creating a user profile for a session"""
        print("\n=== Testing Create User Profile ===")
        try:
            if not self.session_id:
                raise Exception("No session ID available. Create session test must pass first.")
                
            profile_data = {
                "eta": "45",
                "genere": "maschile",
                "sintomo_principale": "mal di testa persistente",
                "durata": "3 giorni",
                "intensita": [7],
                "sintomi_associati": ["nausea", "sensibilità alla luce"],
                "condizioni_note": ["ipertensione"],
                "familiarita": "emicrania nella madre"
            }
            
            response = requests.post(
                f"{BACKEND_URL}/chat/profile/{self.session_id}",
                json=profile_data
            )
            data = response.json()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            assert response.status_code == 200, "Create profile failed with non-200 status code"
            assert data["session_id"] == self.session_id, "Session ID mismatch"
            assert data["sintomo_principale"] == profile_data["sintomo_principale"], "Symptom mismatch"
            
            self.test_results["create_profile"] = True
            print("✅ Create Profile Test: PASSED")
        except Exception as e:
            self.test_results["create_profile"] = False
            print(f"❌ Create Profile Test: FAILED - {str(e)}")
    
    def test_get_profile(self):
        """Test retrieving a user profile for a session"""
        print("\n=== Testing Get User Profile ===")
        try:
            if not self.session_id:
                raise Exception("No session ID available. Create session test must pass first.")
                
            response = requests.get(f"{BACKEND_URL}/chat/profile/{self.session_id}")
            data = response.json()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            assert response.status_code == 200, "Get profile failed with non-200 status code"
            assert data["session_id"] == self.session_id, "Session ID mismatch"
            assert "sintomo_principale" in data, "Profile data incomplete"
            
            self.test_results["get_profile"] = True
            print("✅ Get Profile Test: PASSED")
        except Exception as e:
            self.test_results["get_profile"] = False
            print(f"❌ Get Profile Test: FAILED - {str(e)}")
    
    def test_welcome_message(self):
        """Test generating a welcome message"""
        print("\n=== Testing Welcome Message ===")
        try:
            if not self.session_id:
                raise Exception("No session ID available. Create session test must pass first.")
                
            response = requests.post(f"{BACKEND_URL}/chat/welcome/{self.session_id}")
            data = response.json()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            assert response.status_code == 200, "Welcome message failed with non-200 status code"
            assert data["session_id"] == self.session_id, "Session ID mismatch"
            assert data["message_type"] == "assistant", "Message type is not assistant"
            assert data["content"], "Welcome message is empty"
            assert "next_questions" in data, "No suggested questions in response"
            
            self.test_results["welcome_message"] = True
            print("✅ Welcome Message Test: PASSED")
        except Exception as e:
            self.test_results["welcome_message"] = False
            print(f"❌ Welcome Message Test: FAILED - {str(e)}")
    
    def test_chat_conversation(self):
        """Test a complete chat conversation with Gemini"""
        print("\n=== Testing Chat Conversation ===")
        try:
            if not self.session_id:
                raise Exception("No session ID available. Create session test must pass first.")
            
            # Test with a normal symptom
            normal_message = "Ho un leggero mal di testa da ieri, ma non è molto forte"
            print(f"Sending normal symptom message: '{normal_message}'")
            
            response = requests.post(
                f"{BACKEND_URL}/chat/message",
                json={"session_id": self.session_id, "message": normal_message}
            )
            data = response.json()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            assert response.status_code == 200, "Chat message failed with non-200 status code"
            assert data["session_id"] == self.session_id, "Session ID mismatch"
            assert "user_message" in data, "No user message in response"
            assert "assistant_message" in data, "No assistant message in response"
            assert data["assistant_message"]["urgency_level"] in ["low", "medium", "high"], "Invalid urgency level"
            
            # Test with a more serious symptom
            serious_message = "Ho un forte dolore al petto che si irradia al braccio sinistro e fatico a respirare"
            print(f"\nSending serious symptom message: '{serious_message}'")
            
            response = requests.post(
                f"{BACKEND_URL}/chat/message",
                json={"session_id": self.session_id, "message": serious_message}
            )
            data = response.json()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            assert response.status_code == 200, "Chat message failed with non-200 status code"
            assert data["assistant_message"]["urgency_level"] in ["medium", "high"], "Serious symptom not marked with appropriate urgency"
            assert data["assistant_message"]["next_questions"], "No follow-up questions for serious symptom"
            
            self.test_results["chat_conversation"] = True
            print("✅ Chat Conversation Test: PASSED")
        except Exception as e:
            self.test_results["chat_conversation"] = False
            print(f"❌ Chat Conversation Test: FAILED - {str(e)}")
    
    def test_conversation_history(self):
        """Test retrieving conversation history"""
        print("\n=== Testing Conversation History ===")
        try:
            if not self.session_id:
                raise Exception("No session ID available. Create session test must pass first.")
                
            response = requests.get(f"{BACKEND_URL}/chat/history/{self.session_id}")
            data = response.json()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(data[:2], indent=2)}") # Show only first 2 messages to avoid clutter
            print(f"Total messages: {len(data)}")
            
            assert response.status_code == 200, "History retrieval failed with non-200 status code"
            assert isinstance(data, list), "History is not a list"
            assert len(data) >= 3, "History should contain at least 3 messages (welcome + 2 exchanges)"
            
            # Verify message types alternate correctly
            message_types = [msg["message_type"] for msg in data]
            print(f"Message types sequence: {message_types}")
            
            self.test_results["conversation_history"] = True
            print("✅ Conversation History Test: PASSED")
        except Exception as e:
            self.test_results["conversation_history"] = False
            print(f"❌ Conversation History Test: FAILED - {str(e)}")
    
    def test_session_summary(self):
        """Test retrieving session summary"""
        print("\n=== Testing Session Summary ===")
        try:
            if not self.session_id:
                raise Exception("No session ID available. Create session test must pass first.")
                
            response = requests.get(f"{BACKEND_URL}/chat/summary/{self.session_id}")
            data = response.json()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            assert response.status_code == 200, "Summary retrieval failed with non-200 status code"
            assert data["session_id"] == self.session_id, "Session ID mismatch"
            assert "max_urgency_level" in data, "No urgency level in summary"
            assert "symptoms_mentioned" in data, "No symptoms in summary"
            assert "user_profile" in data, "No user profile in summary"
            
            self.test_results["session_summary"] = True
            print("✅ Session Summary Test: PASSED")
        except Exception as e:
            self.test_results["session_summary"] = False
            print(f"❌ Session Summary Test: FAILED - {str(e)}")
    
    def test_close_session(self):
        """Test closing a chat session"""
        print("\n=== Testing Close Session ===")
        try:
            if not self.session_id:
                raise Exception("No session ID available. Create session test must pass first.")
                
            response = requests.post(f"{BACKEND_URL}/chat/close/{self.session_id}")
            data = response.json()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            assert response.status_code == 200, "Close session failed with non-200 status code"
            assert data["session_id"] == self.session_id, "Session ID mismatch"
            assert "message" in data, "No confirmation message"
            
            # Verify session is marked as completed
            response = requests.get(f"{BACKEND_URL}/chat/session/{self.session_id}")
            session_data = response.json()
            
            print(f"Session status after closing: {session_data['status']}")
            assert session_data["status"] == "completed", "Session not marked as completed"
            assert session_data["end_time"] is not None, "End time not set"
            
            self.test_results["close_session"] = True
            print("✅ Close Session Test: PASSED")
        except Exception as e:
            self.test_results["close_session"] = False
            print(f"❌ Close Session Test: FAILED - {str(e)}")
    
    def print_test_summary(self):
        """Print a summary of all test results"""
        print("\n=== MedAgent Backend Test Summary ===")
        
        all_passed = True
        for test_name, result in self.test_results.items():
            status = "✅ PASSED" if result else "❌ FAILED"
            if not result:
                all_passed = False
            print(f"{test_name}: {status}")
        
        if all_passed:
            print("\n🎉 All backend tests PASSED!")
        else:
            print("\n⚠️ Some tests FAILED. See details above.")

if __name__ == "__main__":
    tester = MedAgentBackendTest()
    tester.run_all_tests()