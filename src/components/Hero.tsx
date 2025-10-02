import React from "react";

const Hero = () => {
  return (
    <section className="container py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="mx-auto max-w-4xl text-center space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <span className="text-sm font-medium text-primary">แกลเลอรีพรอมต์ AI</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          BANANA Promptz
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/80 font-light">
          แบ่งปันและค้นพบพรอมต์ AI ที่ดีที่สุด
        </p>
        
        <p className="mx-auto max-w-2xl text-base text-muted-foreground font-light">
          แกลเลอรีพรอมต์ชุมชนสำหรับการแชร์และค้นหาพรอมต์ AI คุณภาพสูง
          เรียกดูผลงานยอดนิยม คัดลอกพรอมต์ และสร้างสรรค์ผลงานของคุณเอง
        </p>
      </div>
    </section>
  );
};

export default Hero;
