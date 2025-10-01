import React from "react";

const Hero = () => {
  return (
    <section className="container py-20 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          สตูดิโอและแกลเลอรีพรอมต์ชุมชน
        </p>
        
        <h1 className="mb-8 text-4xl md:text-6xl font-bold tracking-tight">
          แบ่งปัน{" "}
          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-lg">
            พรอมต์
          </span>{" "}
          เบื้องหลังผลงานศิลปะ ค้นพบภาพ AI ที่กำลังมาแรงและสร้างแรงบันดาลใจให้คุณ
        </h1>
        
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          BANANA Promptz คือแกลเลอรีเปิดที่ศิลปิน AI แบ่งปันความลับของพวกเขา
          และแฟนๆ ที่อยากรู้สามารถค้นพบสิ่งที่เป็นไปได้ เรียกดูผลงานยอดนิยม
          คัดลอกพรอมต์ที่แท้จริง และติดตามเทรนด์ที่กำลังสร้างศิลปะสร้างสรรค์
        </p>
      </div>
    </section>
  );
};

export default Hero;
