const { GoogleGenerativeAI } = require('@google/generative-ai');
console.log('GoogleGenerativeAI', typeof GoogleGenerativeAI, GoogleGenerativeAI.length);
const proto = GoogleGenerativeAI.prototype;
console.log('methods:', Object.getOwnPropertyNames(proto).filter((name) => typeof proto[name] === 'function'));
