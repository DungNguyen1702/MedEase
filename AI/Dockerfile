# ./AI/Dockerfile
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements if any (you can generate this with `pip freeze > requirements.txt`)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source code
COPY . .

# Expose the Flask port
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
