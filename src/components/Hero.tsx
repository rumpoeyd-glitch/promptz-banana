import React from "react";

const Hero = () => {
  return (
    <section className="container py-20 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          COMMUNITY PROMPT STUDIO & GALLERY
        </p>
        
        <h1 className="mb-8 text-4xl md:text-6xl font-bold tracking-tight">
          Share the{" "}
          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-lg">
            prompts
          </span>{" "}
          behind the art. Discover trending AI images that inspire your next creation.
        </h1>
        
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Banana Prompts is the open gallery where AI artists share their secrets
          and curious fans discover what's possible. Browse the most-loved pieces,
          copy the exact prompts, and track the trends shaping generative art.
        </p>
      </div>
    </section>
  );
};

export default Hero;
