//test for back-end
//test to see if the API call for back-end is returning the correct status code (200)

test('correct status code returned', async () => {
    const data = await fetch(`https://itunes.apple.com/search?media=music&term=metallica`)
    expect(data.status).toBe(200);
    })