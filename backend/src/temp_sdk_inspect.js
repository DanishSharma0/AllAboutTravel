const sdk = require('@google/generative-ai');
console.log('export keys:', Object.keys(sdk));
for (const key of Object.keys(sdk)) {
  try {
    const value = sdk[key];
    console.log('---', key, typeof value);
    if (typeof value === 'function') {
      console.log('  function length', value.length);
      console.log('  name', value.name);
    }
  } catch (err) {
    console.error('inspect error', key, err.message);
  }
}
