'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Gallery({ images, name }) {
  const list = images.length ? images : ['/uploads/sample-product.svg'];
  const [active, setActive] = useState(list[0]);
  return (
    <div>
      <div className="relative aspect-square glass rounded-2xl overflow-hidden">
        <Image src={active} alt={name} fill className="object-cover" priority sizes="(max-width:768px) 100vw, 50vw"/>
      </div>
      {list.length>1 && (
        <div className="flex gap-3 mt-4">
          {list.map((img,i)=>(
            <button key={i} onClick={()=>setActive(img)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border ${active===img?'border-gold':'border-white/10'}`}>
              <Image src={img} alt="" fill className="object-cover"/>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
