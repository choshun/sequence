import { _supabase } from "../supabase/+server"
import { type UserResponse, type User } from '@supabase/supabase-js'


export async function POST() {
	return _signUp()
}

// https://supabase.com/docs/reference/javascript/auth-api
// Might be rate limited:
// https://supabase.com/dashboard/project/nrscqlptbcadomrrqftg/auth/rate-limits
export async function _signUp() {
	const { data, error } = await _supabase.auth.signUp({
		email: 'choshun.snyder@gmail.com',
		password: 'example-password',
	})

	console.log(data)

	return new Response(JSON.stringify(data), { status: 200 })
}

async function _signIn() {
	const { data, error } = await _supabase.auth.signInWithPassword({
		email: 'choshun.snyder@gmail.com',
		password: 'example-password',
	})

	console.log(data)

	return data;
}

export async function _getUser(jwt?: any): Promise<User | null> {
	const { data: { user } } = await _supabase.auth.getUser(jwt)
	console.log(user)

	return user
}

export async function _getSession() {
	const { data, error } = await _supabase.auth.getSession()
	return data
}

export async function _signOut() {
	const { error } = await _supabase.auth.signOut()
	return error
}

export async function _updateUser(email: string, password: string) {
	const { data, error } = await _supabase.auth.updateUser({
		email,
		password
	})
}