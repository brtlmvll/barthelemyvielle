# Project pages — 4 November 2026

30 standalone project pages plus /projects/index.html. main.html remains the animated homepage. index.html remains the existing password entry, untouched.

Archive images are served locally. No GIF binaries are included in this commit or its history: 12 GIFs were replaced by chosen JPEG stills; animated originals remain on Bart's Desktop. No autoplay GIF download.

assets/project-catalogue.json is the map for links, disciplines, image sequences and lightweight previews. tools/build_projects.py rebuilds static pages from existing ARCHIVE/DESC/PRINTS/GC data in main.html; preview paths are preserved from assets/previews. tools/connect_projects.py and refine_shapes.py are one-time source migration helpers, not runtime dependencies.

Taxonomy: U-Exist is Print & Surface; Hshtgs is Identity; Vibra/Golfinho/Longchamp are Treatments; Maskné Protect is 3D & Motion. The 11 pattern pages retain their existing client labels rather than inventing a Kiwami attribution.

Motion: irregular SVG ink fragments on shape hover, three alternating gestures; low-amplitude idle shape motion; section-specific monochrome preview sequences; image-fragment canvas reassembly on project figures; visible motion pause control and reduced-motion support. No image sequence is used as a claim that a film was produced.

Studies: Garden & City has its own research dossier with Signage, Illustration, Campaign and Spaces chapters, marked research/proposals.

Cache: _headers revalidates HTML and page modules, module URLs include a version. Existing password page is preserved; this work does not add server-side authentication.
