//test for front end
//test to see if the API call for server is returning the correct status code (200)
test('correct status code returned', async () => {
    const data = await fetch(`http://localhost:8080/itunesSearchResults`)
    expect(data.status).toBe(200);
    });