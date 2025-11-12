'use client'

import React from 'react'

type Props = { children: React.ReactNode; fallback?: React.ReactNode }

export default class ClientErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // noop: prevent crash overlay; could report to analytics here
    console.error('Client runtime error captured by boundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
