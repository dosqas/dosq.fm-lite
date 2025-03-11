import { NextResponse } from 'next/server';
import client from '../../../lib/db';

export async function GET() {
  try {
    // Query the database for a username
    const result = await client.query('SELECT username FROM users LIMIT 1');

    // Get the username from the result, or set a default message if no result
    const username = result.rows[0]?.username || 'No username found in the database';

    // Return the response as JSON with the username
    return NextResponse.json({ message: `User: ${username}. Hello world!` });
  } catch (error) {
    console.error(error);
    
    // Return a response with an error message
    return NextResponse.json({ message: 'Error fetching data from the database.' });
  }
}
