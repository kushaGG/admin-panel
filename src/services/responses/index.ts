import { Response } from 'express'

interface ISuccess<T> {
	success: boolean
	data?: T
}

export const success =
	<T>(res: Response, status: number) =>
	(entity: T) => {
		const response: ISuccess<T> = {
			success: true,
		}

		res.status(status)

		if (status === 204) {
			res.end()
		} else {
			response.data = entity
			res.send(response)
		}
	}
