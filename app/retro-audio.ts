export type Cue='flip'|'clear';
// Original chiptune phrases synthesized locally; no downloads or autoplay.
export class RetroAudio{
 private context:AudioContext|null=null;
 private voices=new Set<OscillatorNode>();
 private enabled=true;
 private generation=0;
 setEnabled(enabled:boolean){this.enabled=enabled;if(!enabled)this.stop();}
 stop(){this.generation++;for(const voice of this.voices){try{voice.stop()}catch{}}this.voices.clear();}
 async play(cue:Cue){
 if(!this.enabled)return;
 const generation=this.generation;
 try{
 const Constructor=window.AudioContext||(window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
 if(!Constructor)return;
 this.context??=new Constructor();
 const ctx=this.context;if(ctx.state==='suspended')await ctx.resume();
 if(!this.enabled||generation!==this.generation||ctx.state!=='running')return;
 const now=ctx.currentTime+.012;
 const notes=cue==='flip'?[76,83,88]:[72,76,79,84,79,84,86,88,91,88,84];
 const beat=cue==='flip'?.055:.13;
 const tone=(midi:number,at:number,duration:number,type:OscillatorType,level:number)=>{
 const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type=type;oscillator.frequency.value=440*2**((midi-69)/12);
 gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(level,at+.006);gain.gain.setValueAtTime(level,at+duration*.55);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
 oscillator.connect(gain);gain.connect(ctx.destination);this.voices.add(oscillator);
 oscillator.onended=()=>{this.voices.delete(oscillator);oscillator.disconnect();gain.disconnect()};oscillator.start(at);oscillator.stop(at+duration+.01);
 };
 notes.forEach((note,i)=>tone(note,now+i*beat,i===notes.length-1?beat*2:beat*.85,'square',cue==='flip'?.025:.03));
 if(cue==='clear')[48,55,53,55,48].forEach((note,i)=>tone(note,now+i*beat*2,beat*1.7,'triangle',.045));
 }catch{/* Audio availability never blocks gameplay. */}
 }
 dispose(){this.stop();void this.context?.close().catch(()=>{});this.context=null;}
}
