export function formatAxiosError(err) {
  if (!err) return 'Unknown error'
  // axios errors: err.response / err.request
  if (err.response && err.response.data) {
    if (typeof err.response.data === 'string') return err.response.data
    if (err.response.data?.error) return String(err.response.data.error)
    return 'Request failed'
  }
  return err.message ? String(err.message) : 'Request failed'
}

