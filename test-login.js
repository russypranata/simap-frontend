const login = async () => {
    const url = "http://10.10.11.163:8000/api/v1/auth/login";
    const body = {
        username: "siswa123",
        password: "password"
    };

    console.log("Testing Login to:", url);
    console.log("Payload:", body);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Error:", error.message);
    }
};

login();
