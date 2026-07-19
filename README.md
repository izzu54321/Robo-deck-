# Bot Deck — Robot Performance Stage

Ek static website hai (HTML+CSS+JS, koi build step nahi) jisme aapke 7 robots
alag-alag movements perform karte hain: side se walk-in, ladder chadhna, top se
latakna, beech me chair la kar baithna, aur car/bike/cycle chalana. Neeche 5
"3D spin dial" hain jinse scene, robot count, vehicle, speed aur theme badal
sakte ho — dial ko tap ya swipe karo, wo spin hoga.

## Phone se GitHub par daalna

1. GitHub app (ya mobile browser me github.com) khol kar naya repo banao,
   naam do jaise `bot-deck`.
2. Repo ke andar "Add file → Upload files" par jao.
3. Is folder ke andar ke saare files/folders select karo:
   `index.html`, `style.css`, `script.js`, aur poora `assets/` folder
   (7 robot images ke saath).
4. Commit karo.

## Vercel se deploy

1. vercel.com par apne GitHub account se login karo.
2. "Add New → Project" → apna `bot-deck` repo select karo.
3. Framework: "Other" / "Static" chuno — koi build command nahi chahiye,
   Output directory root (`/`) hi rehne do.
4. Deploy dabao — 30-40 second me live link mil jayega, jo phone par bhi
   khulega.

## Image generator ke baare me (important)

Aapne "unlimited image generator, free API, nature ai" mangi thi — maine
isse jaan-bujh kar site me nahi jodha, kyunki mujhe koi verified/legit free
"nature ai" image-generation API nahi pata jo bina key ke reliably kaam kare.
Agar galat ya fake API jod deta to site live hone ke baad crash ya error
dikhati. Agar aap koi specific service (jaise ek API key jo aapke paas hai,
ya Pollinations.ai jaisa koi free/no-key image API) bata do, to us key ke
liye ek chhota sa panel bana kar jod sakta hoon.
