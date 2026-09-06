export type Card={id:number;fruit:number;matched:boolean};
export const stages=[8,12,16,20,24,28,32,36,40,44];
export type Game={cards:Card[];selected:number[];phase:'ready'|'preview'|'hint'|'play'|'won';moves:number;message:string;stage:number;round:number};
export type Action={type:'start';cards:Card[];stage?:number}|{type:'next'}|{type:'ready'}|{type:'flip';id:number}|{type:'resolve'}|{type:'hint'};
export function shuffle<T>(items:T[]):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function deck(stage=0):Card[]{const pairs=(stages[stage]??stages[0])/2;return Array.from({length:pairs*2},(_,id)=>({id,fruit:Math.floor(id/2)%9,matched:false}));}
export const initial:Game={cards:deck(),selected:[],phase:'ready',moves:0,message:'같은 과일을 두 장씩 찾아보세요.',stage:0,round:0};
export function reducer(s:Game,a:Action):Game{
 if(a.type==='start'){const stage=a.stage??s.stage;if(!Number.isInteger(stage)||stage<0||stage>=stages.length)return s;return {...initial,cards:a.cards,stage,round:s.round+1,phase:'preview',message:'3초 동안 과일의 위치를 기억하세요!'};}
 if(a.type==='next'){if(s.phase!=='won'||s.stage>=stages.length-1)return s;return {...initial,stage:s.stage+1,round:s.round+1,cards:shuffle(deck(s.stage+1)),phase:'preview',message:'새로운 스테이지! 3초 동안 위치를 기억하세요.'};}
 if(a.type==='ready')return (s.phase==='preview'||s.phase==='hint')?{...s,phase:'play',message:'카드 두 장을 선택하세요.'}:s;
 if(s.phase!=='play')return s;
 if(a.type==='resolve'){
 if(s.selected.length!==2)return s;
 const [one,two]=s.selected.map(id=>s.cards.find(c=>c.id===id)!);
 const match=one.fruit===two.fruit;
 const cards=s.cards.map(c=>match&&s.selected.includes(c.id)?{...c,matched:true}:c);
 const won=cards.every(c=>c.matched);
 return {...s,cards,selected:[],phase:won?'won':'play',message:won?(s.stage===9?'축하해요! 10개 스테이지를 모두 완료했어요!':'스테이지 클리어! 다음 도전을 시작해 볼까요?'):match?'찰떡궁합! 한 쌍을 찾았어요.':'아쉬워요. 위치를 기억하고 다시 도전!'};
 }
 if(s.selected.length===2)return s;
 if(a.type==='hint')return {...s,phase:'hint',message:'힌트! 3초 동안 남은 과일을 기억하세요.'};
 if(a.type==='flip'){
 const card=s.cards.find(c=>c.id===a.id);
 if(!card||card.matched||s.selected.includes(a.id))return s;
 return {...s,selected:[...s.selected,a.id],moves:s.moves+(s.selected.length===1?1:0)};
 }

 return s;
}
