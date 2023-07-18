document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const designation = document.getElementById('designation').value;
    const branch = document.getElementById('branch').value;
    const password = document.getElementById('password').value;
  
    try {
      // Send login request to the backend
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ designation, branch, password })
      });
  
      if (response.ok) {
        const { token } = await response.json();
  
        // Store the token in local storage or as a cookie
        localStorage.setItem('token', token);
  
        // Redirect to the protected page or perform other actions
        window.location.href = '/protected';
      } else {
        const { error } = await response.json();
        console.log(error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  });
  