import { ImageResponse } from 'next/og';
export const alt = 'OG Studios.Tech — Build. Learn. Create.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() { return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',padding:'80px',background:'#090b0f',color:'white',fontFamily:'sans-serif'}}><div style={{fontSize:28,letterSpacing:6,color:'#8ea0b5'}}>OG STUDIOS.TECH</div><div style={{fontSize:92,fontWeight:800,lineHeight:0.95,marginTop:30}}>BUILD.<br/>LEARN.<br/>CREATE.</div><div style={{fontSize:26,color:'#aab2bd',marginTop:35}}>Software · AI · IoT · Digital Products · Education</div></div>, size); }
