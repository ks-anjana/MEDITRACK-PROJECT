# Environment Configuration Guide

## Server Environment Variables (.env)

Create a `.env` file in the `server/` directory with the following variables:

### Development Setup

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/meditrack

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Production Setup (MongoDB Atlas)

```env
# Use MongoDB Atlas cloud database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/meditrack?retryWrites=true&w=majority

# Use a strong secret in production
JWT_SECRET=generate_a_very_long_random_string_here_at_least_32_characters

# Production settings
PORT=5000
NODE_ENV=production
```

## How to Generate JWT_SECRET

### Option 1: Using Node.js
```bash
# In terminal/command prompt
node
> require('crypto').randomBytes(32).toString('hex')
# Copy the output and use as JWT_SECRET
```

### Option 2: Using OpenSSL
```bash
openssl rand -hex 32
```

### Option 3: Online Generator
- Visit: https://www.random.org/bytes/
- Generate 32 bytes
- Convert to hex

## MongoDB Setup

### Local MongoDB

**Windows:**
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Run installer (MSI file)
3. Choose "Install MongoDB as a Service"
4. MongoDB will start automatically
5. Connection string: `mongodb://localhost:27017/meditrack`

**Mac:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community
```

**Linux (Ubuntu):**
```bash
# Install
sudo apt-get install -y mongodb

# Start
sudo systemctl start mongodb

# Stop
sudo systemctl stop mongodb
```

### MongoDB Atlas (Cloud - Recommended)

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Verify email

2. **Create Cluster:**
   - Click "Create a Deployment"
   - Choose "Free" tier
   - Select region (closest to you)
   - Click "Create Cluster"
   - Wait 2-3 minutes for cluster to be created

3. **Create Database User:**
   - In cluster settings, click "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Note these credentials (you'll need them)

4. **Get Connection String:**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://myuser:mypassword@cluster.mongodb.net/meditrack`

5. **Update .env:**
   ```env
   MONGO_URI=mongodb+srv://myuser:mypassword@cluster.mongodb.net/meditrack?retryWrites=true&w=majority
   ```

## Frontend Environment Configuration

The frontend uses Vite, which loads environment variables from `.env.local` or `.env` files prefixed with `VITE_`.

**Create `client/.env.local` (optional):**
```env
VITE_API_URL=http://localhost:5000
```

**Current API Configuration:**
The frontend is configured to proxy API requests to `http://localhost:5000` in development via `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

## Quick Environment Verification

### Check if MongoDB is running

**Windows:**
```bash
# Check if mongod process exists
tasklist | findstr mongod

# Or connect with mongo shell
mongo mongodb://localhost:27017
```

**Mac/Linux:**
```bash
# Check service status
brew services list | grep mongodb

# Or connect
mongo mongodb://localhost:27017
```

### Check if Backend is running

```bash
# Test API endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"message":"Server is running"}
```

### Check if Frontend is running

```bash
# Just visit http://localhost:3000 in browser
# Should load without errors
```

## Environment Variables Checklist

### Backend (.env)
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Secret for JWT signing (32+ characters)
- [ ] `PORT` - Server port (default: 5000)
- [ ] `NODE_ENV` - Environment type (development/production)

### Frontend (vite.config.js)
- [ ] Server port set to 3000
- [ ] API proxy configured to http://localhost:5000

## Switching Between Local and Cloud Database

### To use Local MongoDB:
```env
MONGO_URI=mongodb://localhost:27017/meditrack
```

### To use MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/meditrack?retryWrites=true&w=majority
```

**Note:** You only need to restart the server after changing MONGO_URI.

## Security Best Practices

1. **Never commit .env files to Git**
   - Add `.env` to `.gitignore` (already done)
   - Add `.env.local` to `.gitignore`

2. **Use different secrets for each environment:**
   - Development: Simple JWT secret (change before production)
   - Production: Generated strong JWT secret (32+ random characters)

3. **MongoDB Atlas:**
   - Create separate database users for dev and production
   - Use strong passwords
   - Enable IP whitelist (only your server IP in production)

4. **API Keys:**
   - Never expose API keys in frontend code
   - Keep JWT_SECRET on server only
   - Rotate keys periodically in production

## Testing Environment Setup

For development testing, you can use:

```env
# Development
MONGO_URI=mongodb://localhost:27017/meditrack
JWT_SECRET=dev_secret_key_not_for_production_123456
PORT=5000
NODE_ENV=development
```

## Deployment Environment Setup

For production deployment, update to:

```env
# Production
MONGO_URI=mongodb+srv://produser:prodpass@cluster.mongodb.net/meditrack?retryWrites=true&w=majority
JWT_SECRET=<generated_random_32_char_string>
PORT=5000
NODE_ENV=production
```

## Troubleshooting Environment Issues

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Verify MongoDB is running
2. Check MONGO_URI is correct
3. For Atlas, check IP whitelist
4. Check database user credentials

### Issue: "JWT token verification failed"
**Solution:**
1. Check JWT_SECRET is consistent
2. Don't change JWT_SECRET while running
3. Restart server after changing JWT_SECRET

### Issue: "Frontend cannot connect to API"
**Solution:**
1. Check backend is running on port 5000
2. Verify proxy in vite.config.js points to correct URL
3. Check for CORS errors in browser console

### Issue: "Port already in use"
**Solution:**
1. Change PORT in .env to different number (5001, 5002, etc.)
2. Or kill the process using the port

## Environment Variables Reference

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| MONGO_URI | String | Yes | - | MongoDB connection string |
| JWT_SECRET | String | Yes | - | Secret key for JWT signing |
| PORT | Number | No | 5000 | Server port |
| NODE_ENV | String | No | development | Environment type |

---

**Updated:** December 2024
**Version:** 1.0.0
