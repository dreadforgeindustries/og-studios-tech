'use client';
import {useEffect} from 'react';
import Link from 'next/link';

export default function ErrorPage({error, reset}: {error: Error & {digest?: string}; reset: () => void}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="form-shell" style={{textAlign: 'center'}}>
      <div className="eyebrow">500 / SOMETHING WENT WRONG</div>
      <h1>We hit a problem.</h1>
      <p className="hero-copy" style={{margin: '20px auto'}}>
        Nothing sensitive is exposed here. Try again or return to the homepage.
      </p>
      <div style={{display: 'flex', justifyContent: 'center', gap: 10}}>
        <button className="btn btn-blue" onClick={reset}>Try again</button>
        <Link href="/" className="btn">Home</Link>
      </div>
    </section>
  );
}