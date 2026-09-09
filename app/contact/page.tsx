import type {Metadata} from 'next'; import {ContactForm} from '@/components/Forms';
export const metadata:Metadata={title:'Contact',description:'Contact OG Studios.Tech.'};
export default function Contact(){return <section className="form-shell"><div className="eyebrow">CONTACT</div><h1>Let’s talk.</h1><p className="hero-copy">Questions, technical assistance, workshops or an early project conversation — send a message.</p><div style={{marginTop:35}}><ContactForm/></div></section>}
