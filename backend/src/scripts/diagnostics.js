#!/usr/bin/env node

/**
 * Diagnostics script to verify registration setup
 */

const axios = require('axios');
const http = require('http');

const BACKEND_URL = 'http://localhost:5000';
const API_URL = `${BACKEND_URL}/api`;

async function checkBackendConnection() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/health`, { timeout: 5000 });
    console.log('✓ Backend is running');
    return true;
  } catch (error) {
    console.error('✗ Backend is not running or not responding');
    console.error(`  Error: ${error.message}`);
    return false;
  }
}

async function testRegistration() {
  try {
    const userData = {
      name: 'Diagnostic Test User',
      email: `diag-test-${Date.now()}@gmail.com`,
      password: 'Test12345!',
      phone: '9999999999',
    };

    console.log('\nAttempting registration with:');
    console.log(`  Name: ${userData.name}`);
    console.log(`  Email: ${userData.email}`);
    console.log(`  Phone: ${userData.phone}`);

    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      timeout: 5000,
    });

    console.log('\n✓ Registration successful!');
    console.log('Response:', {
      message: response.data.message,
      token: response.data.token ? 'Present' : 'Missing',
      user: response.data.user,
    });
    return true;
  } catch (error) {
    console.error('\n✗ Registration failed');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Message: ${error.response.data?.message || 'No message'}`);
      console.error(`  Error: ${error.response.data?.error || 'No error details'}`);
    } else {
      console.error(`  Error: ${error.message}`);
    }
    return false;
  }
}

async function runDiagnostics() {
  console.log('=== Registration Diagnostics ===\n');

  const backendRunning = await checkBackendConnection();
  
  if (!backendRunning) {
    console.log('\n⚠️  Please start the backend server first:');
    console.log('   cd backend');
    console.log('   npm start');
    process.exit(1);
  }

  const registrationWorks = await testRegistration();

  console.log('\n=== Diagnostics Complete ===');
  if (registrationWorks) {
    console.log('✓ Everything looks good!');
  } else {
    console.log('✗ There are issues with registration');
  }
}

runDiagnostics();
