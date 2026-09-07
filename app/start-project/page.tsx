import type {Metadata} from 'next'; import {ProjectWizard} from '@/components/Forms';
export const metadata:Metadata={title:'Start a Project',description:'Share your project requirements with OG Studios.Tech.'};
export default function Start(){return <section className="form-shell"><div className="eyebrow">START A PROJECT</div><h1>Let’s build something real.</h1><p className="hero-copy">Tell us what you’re trying to build. Pricing is discussed privately after the requirements are understood.</p><div style={{marginTop:35}}><ProjectWizard/></div></section>}
