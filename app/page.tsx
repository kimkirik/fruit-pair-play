'use client';
import {useEffect,useReducer,useState,useRef,type CSSProperties} from 'react';
import {flushSync} from 'react-dom';
import {ArrowRight, RotateCcw, Clock3, MousePointer2, Check, Sparkles, Leaf, Trophy, Eye, Volume2} from 'lucide-react';
import {Progress} from '@/components/ui/progress';
import {Switch} from '@/components/ui/switch';
import {RetroAudio,type Cue} from './retro-audio';
import {deck,initial,reducer,shuffle,stages} from './game';
const names=['딸기','오렌지','레몬','아보카도','체리','블루베리','포도','수박','복숭아'];
// Centers measured from each fruit silhouette, including leaves, in the 1254px source.
const fruitCenters=[[241.5,238],[645.5,235],[1019.5,259],[232,610],[625,604.5],[1023.5,623.5],[242,976.5],[616,980.5],[1014,986.5]];
const fruitFrameSize=380;
export default function Home(){
 const [game,dispatch]=useReducer(reducer,initial);const [seconds,setSeconds]=useState(0);const [countdown,setCountdown]=useState(3);
 const [soundEnabled,setSoundEnabled]=useState(true);const audio=useRef<RetroAudio|null>(null);const playedWin=useRef(-1);
 const playSound=(cue:Cue)=>{audio.current??=new RetroAudio();audio.current.setEnabled(soundEnabled);void audio.current.play(cue);};
 useEffect(()=>()=>audio.current?.dispose(),[]);
 useEffect(()=>{if(game.phase==='won'&&playedWin.current!==game.round){playedWin.current=game.round;if(soundEnabled)void audio.current?.play('clear');}},[game.phase,game.round,soundEnabled]);
 const found=game.cards.filter(c=>c.matched).length/2;const totalPairs=game.cards.length/2;const finalStage=game.stage===9;
 const start=()=>{audio.current?.stop();setSeconds(0);setCountdown(3);const stage=game.phase==='won'&&finalStage?0:game.stage;dispatch({type:'start',cards:shuffle(deck(stage)),stage});};
 const advance=()=>{audio.current?.stop();setSeconds(0);setCountdown(3);dispatch({type:'next'});};
 useEffect(()=>{if(game.phase!=='preview'&&game.phase!=='hint')return;const tick=setInterval(()=>setCountdown(n=>Math.max(1,n-1)),1000);const end=setTimeout(()=>dispatch({type:'ready'}),3000);return()=>{clearInterval(tick);clearTimeout(end)}},[game.phase,game.round]);
 useEffect(()=>{if(game.phase!=='play'&&game.phase!=='hint')return;const timer=setInterval(()=>setSeconds(n=>n+1),1000);return()=>clearInterval(timer)},[game.phase,game.round]);
 useEffect(()=>{if(game.selected.length!==2)return;const t=setTimeout(()=>dispatch({type:'resolve'}),800);return()=>clearTimeout(t)},[game.selected]);
 useEffect(()=>{
 const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:{signal:AbortSignal})=>void|Promise<void>}}).modelContext;
 if(!context?.registerTool)return;
 const lifecycle=new AbortController();
 try{void Promise.resolve(context.registerTool({name:'start_fruit_pair_game',title:'과일 짝꿍 맞추기 새 게임 시작',description:'현재 게임을 초기화하고 첫 스테이지의 8장 카드로 새 게임을 시작합니다. 3초간 카드를 공개합니다.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:(input:unknown)=>{if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('빈 객체만 입력할 수 있습니다.');flushSync(()=>{setSeconds(0);setCountdown(3);dispatch({type:'start',cards:shuffle(deck()),stage:0})});return {phase:'preview',cards:8,pairs:4};}},{signal:lifecycle.signal})).catch(()=>{});}catch{}
 return()=>lifecycle.abort();
 },[]);
 const locked=game.phase!=='play'||game.selected.length===2;
 return <div className="app-shell"><header className="site-header"><a className="brand" href="/" aria-label="과일 짝꿍 맞추기 홈"><span className="brand-icon"><Leaf size={23}/></span>과일 짝꿍 맞추기<span className="brand-en">FRUIT PAIR</span></a><span className="header-note"><span/>잠깐의 몰입, 달콤한 한 판</span></header>
 <main><div className="heading"><div><div className="eyebrow">A LITTLE BRAIN BREAK</div><h1>과일 <span>짝꿍</span> 맞추기</h1><p>같은 과일을 찾아 작은 성취를 모아보세요.</p></div><div className="mode-tag"><Sparkles size={16}/> {game.cards.length}장 · {totalPairs}쌍</div></div>
 <div className="stage-journey" aria-label={`전체 10개 중 ${game.stage+1} 스테이지`}><div className="stage-heading"><strong>STAGE {String(game.stage+1).padStart(2,'0')} <span>/ 10</span></strong><span>{game.stage<3?'가볍게 시작해요':game.stage<6?'기억력을 펼쳐요':game.stage<9?'조금 더 집중해요':'마지막 도전!'}</span></div><ol>{stages.map((_,i)=><li key={i} className={i<game.stage?'stage-done':i===game.stage?'stage-current':''} aria-current={i===game.stage?'step':undefined}>{i<game.stage?<Check size={14}/>:String(i+1).padStart(2,'0')}</li>)}</ol></div><div className="game-layout"><section className="play-panel" aria-label="카드 게임"><div className="board-top"><span><span className="live-dot"/>{game.phase==='ready'?'준비됐나요?':game.phase==='preview'||game.phase==='hint'?`${game.phase==='hint'?'힌트':'기억할 시간'} · ${countdown}초`:game.phase==='won'?(finalStage?'10 스테이지 완주!':'스테이지 클리어!'):'천천히, 하나씩'}</span><span>{totalPairs}쌍의 과일 친구들</span></div>
 <div className={'board '+(game.phase==='won'?'completed':'')} style={{'--board-rows':game.cards.length/4} as CSSProperties}>
 {game.cards.map((card,index)=>{const open=game.phase==='ready'||game.phase==='preview'||game.phase==='hint'||game.selected.includes(card.id)||card.matched;return <button key={card.id} className={'card '+(open?'is-open ':'')+(card.matched?'is-matched':'')} disabled={locked||card.matched||game.selected.includes(card.id)} onClick={()=>{playSound('flip');dispatch({type:'flip',id:card.id})}} aria-label={`${index+1}번 카드${open?': '+names[card.fruit]:', 뒤집기'}${card.matched?', 짝 맞춤':''}`}><span className="card-inner"><span className="card-back"><span className="back-mark">p<span>·</span></span><span className="back-label">FRUIT PAIR</span></span><span className="card-front"><svg className="fruit" viewBox={`${fruitCenters[card.fruit][0]-fruitFrameSize/2} ${fruitCenters[card.fruit][1]-fruitFrameSize/2} ${fruitFrameSize} ${fruitFrameSize}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><image href="/fruit-atlas.webp" width="1254" height="1254"/></svg>{card.matched&&<span className="match-check"><Check size={15}/></span>}</span></span></button>})}
 </div>
 <div className="board-bottom" aria-live="polite">{game.phase==='won'?<Trophy size={18}/>:<Sparkles size={16}/>}<span>{game.message}</span></div>
 </section>
 <aside className="game-sidebar"><section className="status-panel"><div className="section-label">스테이지 {game.stage+1} <span>PLAY SESSION</span></div><div className="pair-stat" aria-label={`찾은 짝 ${found} / ${totalPairs}`}><strong>{found}<small> / {totalPairs}</small></strong><span>찾은 짝</span></div><Progress value={found/totalPairs*100} aria-label="찾은 카드 쌍"/><div className="mini-stats"><div aria-label={`플레이 시간 ${Math.floor(seconds/60)}분 ${seconds%60}초`}><span><Clock3 size={15}/> 플레이 시간</span><strong>{String(Math.floor(seconds/60)).padStart(2,'0')}<em>:</em>{String(seconds%60).padStart(2,'0')}</strong></div><div aria-label={`시도 ${game.moves}회`}><span><MousePointer2 size={15}/> 시도 횟수</span><strong>{game.moves}<small> 회</small></strong></div></div>
 <button className="start-button" onClick={game.phase==='won'&&!finalStage?advance:start} disabled={game.phase==='preview'||game.phase==='hint'}>{game.phase==='ready'?'게임 시작':game.phase==='won'?(finalStage?'처음부터 다시 도전':'다음 스테이지'):'처음부터 다시'}{game.phase==='play'?<RotateCcw size={18}/>:<ArrowRight size={19}/>}</button><div className="play-tools"><button className="hint-button" disabled={locked} onClick={()=>{setCountdown(3);dispatch({type:'hint'})}}><Eye size={18}/>{game.phase==='hint'?`${countdown}초 동안 보기`:'3초 힌트'}</button><label className="sound-setting" htmlFor="retro-sound"><Volume2 size={17}/><span>레트로 사운드</span><Switch id="retro-sound" checked={soundEnabled} onCheckedChange={(enabled)=>{setSoundEnabled(enabled);audio.current??=new RetroAudio();audio.current.setEnabled(enabled);if(enabled)void audio.current.play('flip');}}/></label></div></section>
 <div className="how-to"><span className="tip-icon"><Leaf size={18}/></span><div><strong>기억력도 가볍게 스트레칭</strong><p>총 10스테이지, 8장부터 44장까지! 같은 과일이 여러 장이어도 두 장씩 맞추면 돼요.</p></div></div>
 </aside></div><footer><span>한 장도 외롭지 않게. 모든 과일은 두 장씩.</span><span>MADE FOR YOUR LITTLE BREAK</span></footer></main></div>
}
