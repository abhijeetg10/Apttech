import { google } from 'googleapis';

const folderId = "1aGDaGk6dWuy_B7MCZOPp9xd1p3T5_5AD";
const clientEmail = "lmsbot@apttech-recorded-lectures.iam.gserviceaccount.com";
const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvDo3Y43CW7oO1\n5zJjWO3A91dbOOtJuqDfzYEgWI4T9pXY+ToOAZFH6KtaM+jVS13VITUekJZzLzLm\nMMJnDgxMHOHd/PCAz+Dv0wX17iis2oovyBzgmn2hFXOJ+CtVd4DixyCzbsEv0jjK\nMTeOnSuqmeP7hGHg85yJc9gn3E1rakKMYy+9lFmE0JsCdAtDJfzzdBdyzLeKVlMn\nzZLnBhEtQhWE1sakawxj3RxKZTv9CmR3jxBIMsbT+sBTcdy/H+ZDehWZIvSTjrG0\nP2ZpQ2uaVG+7fOC5ZdMtynTNNZNPs1GErCJ8FFF8M1HuORpL8i7QlW+N17NTc/Mv\nCP8fDWC7AgMBAAECggEACuacHKJlE3D80Kn58EfMXlTIosyTkj7F38nbPZlmF4Ym\nZKF4ZQDh/BlX+kD7QbT0vd3YgfO8+qU4xS7KHEK6r06pHfqvO0Y2mpiIaX0QGVtu\neXU7nxzfr9U3IaNLh4Hui7Ccr6+45fJwSN7xt7a/zlrQ4Iuo0Ko62DBXiHvmckbM\nNEbiOC4+Huq7fU+dwDt29HVnSAKcvl6Gw0hrtmOFRcKmcBiWZ0u7Vq/EuE3p6JVQ\n7jjDRRraSDo/mvYarrGI5z+7yyaZm0milkzEFK7qVZLXoSrrQE+hGxvqD8+dKsEO\n4Y3eLDB1cnhkmsJkmRY9faXVXh94cYkK1FxrxRsjgQKBgQDlpvA6DfRQWOzwuVZY\ndDi9ltk5SGRUli+0mKCY586aA0kRleeY3Jk2esKM6+HngB8JZIDHyrbzPESfJ0T2\nv49k4eYAsn3hrxRuxpg0dNaRBJVhTCloEfbHsdbNvE0xJz8ltzel1sMOrTeyWT/b\nLXxIUXcwBAF/svKG39gML/NEewKBgQDDJBxMf/v6i5/EIKYRqkdw7EvYPjyt6rl2\nHE5ZW6poV5UDAiDERsaxUBlnyDxOf1oKnwZpPk6jCOfCX/IUjnL8KCQLL2L4zdEm\nY/Bwh+cs+ytQrUTEKovf1zjlP5lYaW17XkBAC5cKCuZacbg8dEjzHLzT9a3kxn1C\nkZs0dBhAwQKBgQCPBM3qebJDL34v1FxvrcGAYKdbQzgobXe8MqkhUIub4pvotcCL\ntCY+hWkPtf7z2xh5EvwYcKhLBqd9rkkGmfnFS+GfYYl/uTcyXb+AO5s8qOwWsgW/\naCCV8KzjZ3dzOwvagyXGw96qDzn2ehqIduVFbGabooMEcf8T++dif6IybQKBgG22\n7M46GwMX44DS1mwSL86WnGH9RAKIeTOl4IsvFZVKwLYLST7xiB8DKPWHyBheU9Kq\n7GDZrj7N7/gCF8pk+NM7AmDjiKLYnSIXiITMdDZ/FTBr6sDcJv54ND34TxA9XlfB\neyBHI+l6jV8Glw4uVyGQ473MYLPCwYRe90M7jrNBAoGBAM3R8sZzg70LGQ4N3QdU\nbaWYYNyTia+YT9ARUlP4Yd0/z66K7h1u+/rfhCxRQ9HqvfN6dVGaqieuG/W3zAiR\nwHA/AfJnklY5DUVvZwA1JB0OyTDMNbin5EeuxpVcjyq1FrX/qyuo90B/FKdax6I/\n3otnyb4UHgoVstOlppoVdJ7d\n-----END PRIVATE KEY-----\n";

async function testDrive() {
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });

  const drive = google.drive({ version: 'v3', auth });
  
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType)',
    });
    console.log("Files found:", res.data.files?.length);
    console.log(res.data.files);
  } catch (err: any) {
    console.error("Error from Drive API:", err.message);
  }
}

testDrive();
