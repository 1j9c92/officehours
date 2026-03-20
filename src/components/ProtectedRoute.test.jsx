import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../lib/supabase', () => ({ supabase: {} }))
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

function renderWithAuth(authValue, route = '/protected') {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/login" element={<div>login page</div>} />
          <Route path="/protected" element={
            <ProtectedRoute>
              <div>protected content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithAuth({ user: null, loading: false, profile: null })
    expect(screen.getByText('login page')).toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    renderWithAuth({ user: { id: '1' }, loading: false, profile: { role: 'mentee' } })
    expect(screen.getByText('protected content')).toBeInTheDocument()
  })

  it('shows nothing while loading', () => {
    const { container } = renderWithAuth({ user: null, loading: true, profile: null })
    expect(container.firstChild).toBeNull()
  })
})
