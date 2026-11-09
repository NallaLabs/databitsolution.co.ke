/* Databit Solution Ltd: hero globe
   A dot-matrix Earth with orbiting rings, drawn on a <canvas> with no
   libraries. Land dots generated from Natural Earth (public domain).
   Pauses when off screen or in a background tab; draws one still frame
   for visitors who prefer reduced motion. */
(function () {
  const canvas = document.getElementById("globe");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  // land points: Int16 pairs of (lat*10, lon*10)
  const raw = atob("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zP/W/cz/5v3M//b9zP8G/sz/Fv7M/yb+zP82/sz/Rv7M/1b+zP9m/sz/dv7M/4b+zP+W/sz/iQDM/5kAzP+pAMz/uQDM/8kAzP/ZAMz/6QDM//kAzP8JAcz/GQHM/ykBzP85Acz/SQHM/1oBzP9qAcz/egHM/x0EzP+tBMz/zQTM/24FzP9+Bcz/jgXM/54FzP+uBcz/7wXc/+D83P/w/Nz/AP3c/xD93P8g/dz/MP3c/0D93P9Q/dz/YP3c/3D93P+A/dz/kP3c/6D93P+w/dz/wP3c/9D93P/g/dz/8P3c/wD+3P8Q/tz/IP7c/zD+3P9A/tz/UP7c/2D+3P9w/tz/cADc/4AA3P+QANz/oADc/7AA3P/AANz/0ADc/+AA3P/wANz/AAHc/xAB3P8gAdz/MAHc/0AB3P9QAdz/YAHc/3AB3P+AAdz/AATc/xAE3P8gBNz/gATc/7AE3P/ABNz/8ATc/0AF3P9QBdz/YAXc/3AF3P+ABdz/kAXs/+D87P/w/Oz/AP3s/xD97P8g/ez/MP3s/0D97P9Q/ez/YP3s/3D97P+A/ez/kP3s/6D97P+w/ez/wP3s/9D97P/g/ez/8P3s/wD+7P8Q/uz/IP7s/zD+7P9A/uz/YADs/3AA7P+AAOz/kADs/6AA7P+wAOz/wADs/9AA7P/gAOz/8ADs/wAB7P8QAez/IAHs/zAB7P9AAez/UAHs/2AB7P9wAez/gAHs/5AB7P8ABOz/EATs/yAE7P9QBOz/YATs/3AE7P+ABOz/sATs/zAF7P9gBez/wAX8/3D8/P/g/Pz/8Pz8/wD9/P8Q/fz/IP38/zD9/P9A/fz/UP38/2D9/P9w/fz/gP38/5D9/P+g/fz/sP38/8D9/P/Q/fz/4P38//D9/P8Q/vz/YAD8/3AA/P+AAPz/kAD8/6AA/P+wAPz/wAD8/9AA/P/gAPz/8AD8/wAB/P8QAfz/IAH8/zAB/P9AAfz/UAH8/2AB/P9wAfz/gAH8/5AB/P+gAfz/8AP8/wAE/P9QBPz/YAT8/3AE/P+ABPz/kAT8/7AE/P8ABQwA8PwMAAD9DAAQ/QwAIP0MADD9DABA/QwAUP0MAGD9DABw/QwAgP0MAJD9DACg/QwAsP0MAMD9DADQ/QwA4P0MAPD9DAAA/gwAYAAMAHAADACAAAwAkAAMAKAADACwAAwAwAAMANAADADgAAwA8AAMAAABDAAQAQwAIAEMADABDABAAQwAUAEMAGABDABwAQwAgAEMAJABDACgAQwAsAEMANADDADgAwwA8AMMAAAEDABQBAwAYAQMAHAEDACABAwAkAQMAKAEDADgBBwAAP0cABD9HAAg/RwAMP0cAED9HABQ/RwAYP0cAHD9HACA/RwAkP0cAKD9HACw/RwAwP0cAND9HADg/RwA8P0cAAD+HABwABwAgAAcAJAAHACgABwAsAAcAMAAHADQABwA4AAcAPAAHAAAARwAEAEcACABHAAwARwAQAEcAFABHABgARwAcAEcAIABHACQARwAoAEcALABHADAARwA4AMcAAAEHABgBBwAcAQcAIAEHACQBCwABf0sABX9LAAl/SwANf0sAEX9LABV/SwAZf0sAHX9LACF/SwAlf0sAKX9LAC1/SwAxf0sANb9LADm/SwA9v0sAEgALABoACwAeQAsAIkALACZACwAqQAsALkALADJACwA2QAsAOkALAD5ACwACQEsABkBLAApASwAOQEsAEkBLABaASwAagEsAHoBLACKASwAmgEsAKoBLAC6ASwAygEsANoBLADMAywA/QMsAH0ELACNBCwAnQQ8AAX9PAAV/TwAJf08ADX9PABF/TwAVf08AGX9PAB1/TwAhf08AJX9PACl/TwAtf08AKj/PAC4/zwAyP88ANj/PADo/zwA+P88AAgAPAA4ADwASAA8AFgAPABoADwAeQA8AIkAPACZADwAqQA8ALkAPADJADwA2QA8AOkAPAD5ADwACQE8ABkBPAApATwAOQE8AEkBPABaATwAagE8AHoBPACKATwAmgE8AKoBPAC6ATwAygE8ANoBPADsAzwA/QM8AI0EPAC9BEwA2fxMAPn8TAAJ/UwAGf1MACr9TAA6/UwASv1MAFr9TABq/UwAev1MAIr9TACb/UwAq/1MAI//TACf/0wAr/9MAL//TADQ/0wA4P9MAPD/TAAAAEwAEABMACAATAAwAEwAQQBMAFEATABhAEwAcQBMAIEATACRAEwAoQBMALIATADCAEwA0gBMAOIATADyAEwAAgFMABIBTAAjAUwAMwFMAEMBTABTAUwAYwFMAHMBTACDAUwAlAFMAKQBTAC0AUwAxAFMANQBTADkAUwAJwNMAOkDTADbBEwA6wRcAL38XADu/FwADv1cAB79XAAu/VwAP/1cAE/9XABf/VwAb/1cAH/9XACQ/VwAoP1cAIb/XACX/1wAp/9cALf/XADH/1wA1/9cAOj/XAD4/1wACABcABgAXAApAFwAOQBcAEkAXABZAFwAaQBcAHoAXACKAFwAmgBcAKoAXAC6AFwAywBcANsAXADrAFwA+wBcAAwBXAAcAVwALAFcADwBXABMAVwAXQFcAG0BXAB9AVwAjQFcAJ4BXACuAVwAvgFcAM4BXADeAVwA7wFcAAIDXAASA1wAIwNcAOUDXADpBGwAsfxsABP9bAAj/WwAM/1sAET9bABU/WwAbf9sAH7/bACO/2wAnv9sAK//bAC//2wAz/9sAN//bADw/2wAAABsABAAbAAhAGwAMQBsAEEAbABRAGwAYgBsAHIAbACCAGwAkwBsAKMAbACzAGwAwwBsANQAbADkAGwA9ABsAAUBbAAVAWwAJQFsADYBbABGAWwAVgFsAGYBbAB3AWwAhwFsAJcBbACoAWwA2AFsAOkBbAD5AWwA/gJsAA4DbAAeA2wA4gNsABMEbAAjBGwAMwRsAMYEfACl/HwAtfx8AGX/fAB1/3wAhf98AJb/fACm/3wAtv98AMf/fADX/3wA5/98APj/fAAIAHwAGQB8ACkAfAA5AHwASgB8AFoAfABqAHwAewB8AIsAfACbAHwArAB8ALwAfADNAHwA3QB8AO0AfAD+AHwADgF8AB4BfAAvAXwAPwF8AE8BfABgAXwAcAF8AIEBfACRAXwAoQF8APkCfAAJA3wAGgN8AN4DfAD/A3wADwR8AB8EfAAwBHwAQAR8ANMEfADkBIwAfPyMAI38jACd/IwArvyMAGP/jAB0/4wAhP+MAJX/jACl/4wAtv+MAMb/jADX/4wA5/+MAPj/jAAIAIwAGQCMACkAjAA6AIwASgCMAFsAjABrAIwAfACMAIwAjACdAIwArQCMAL4AjADOAIwA3wCMAO8AjAAAAYwAEAGMACEBjAAyAYwAQgGMAFMBjABjAYwAdAGMAIQBjACVAYwAtgGMAMYBjADXAYwA7wKMAAADjAAQA4wAIQOMANcDjADnA4wA+AOMAAgEjAAZBIwAKQSMADoEjAC+BIwAzgScAF/8nABw/JwAgPycAJH8nACh/JwAsvycAJr9nABa/5wAa/+cAHv/nACM/5wAnP+cAK3/nAC+/5wAzv+cAN//nADv/5wAAACcABEAnAAhAJwAMgCcAEIAnABTAJwAZACcAHQAnACFAJwAlQCcAKYAnAC2AJwAxwCcANgAnADoAJwA+QCcAAkBnAAaAZwAKwGcADsBnABMAZwAXAGcAG0BnAB+AZwArwGcAMABnADRAZwA4QGcAPIBnAACApwA6wKcAPsCnAAMA5wAHAOcANMDnADjA5wA9AOcAAUEnAAVBJwAJgScADYEnAC7BKwAE/ysACT8rAA1/KwARvysAFb8rABn/KwAePysAIn8rABp/6wAev+sAIv/rACc/6wArP+sAL3/rADO/6wA3/+sAO//rAAAAKwAEQCsACEArAAyAKwAQwCsAFQArABkAKwAdQCsAIYArACXAKwApwCsALgArADJAKwA2gCsAOoArAD7AKwADAGsAB0BrAAtAawAPgGsAE8BrABgAawAcAGsAIEBrACzAawAxAGsANUBrADmAawA9gGsAAcCrAAYAqwA4QKsAPECrAACA6wAEwOsACQDrAA0A6wAugOsAMsDrADcA6wA7QOsAP0DrAAOBKwAHwSsALYErADGBLwA+fu8AAr8vAAb/LwALPy8AD38vABv/LwAgPy8AJH8vAA6/bwAS/28AGj/vAB5/7wAiv+8AJv/vACr/7wAvP+8AM3/vADe/7wA7/+8AAAAvAARALwAIgC8ADMAvABEALwAVQC8AGUAvAB2ALwAhwC8AJgAvACpALwAugC8AMsAvADcALwA7QC8AP4AvAAOAbwAHwG8ADABvABBAbwAUgG8AGMBvAB0AbwApwG8ALcBvADIAbwA2QG8AOoBvAD7AbwADAK8AB0CvAAuArwA6AK8APkCvAAJA7wAGgO8ACsDvAA8A7wATQO8ALIDvADDA7wA1AO8AOUDvAD2A7wABwS8ABgEvABLBMwA7/vMAAD8zAAR/MwAIvzMADP8zAB4/MwAifzMAAD9zAAR/cwAZv/MAHj/zACJ/8wAmv/MAKv/zAC8/8wAzf/MAN7/zADv/8wAAADMABEAzAAiAMwAMwDMAEQAzABVAMwAZgDMAHcAzACIAMwAmgDMAKsAzAC8AMwAzQDMAN4AzADvAMwAAAHMABEBzAAiAcwAMwHMAEQBzABVAcwAZgHMAJkBzACrAcwAvAHMAM0BzADeAcwA7wHMAAACzAARAswAIgLMADMCzADeAswA7wLMAAADzAARA8wAIgPMADMDzABEA8wAVQPMAKoDzAC7A8wAzQPMAN4DzADvA8wAAATMABEEzAAiBNwA5fvcAPf73AAI/NwAGfzcACr83AC0/NwA6PzcAGX/3AB2/9wAh//cAJn/3ACq/9wAu//cAMz/3ADe/9wA7//cAAAA3AARANwAIgDcADQA3ABFANwAVgDcAGcA3AB5ANwAigDcAJsA3ACsANwAvQDcAM8A3ADgANwA8QDcAAIB3AAUAdwAJQHcADYB3ABHAdwAWAHcAGoB3ACMAdwAnQHcAK8B3ADAAdwA0QHcAOIB3AD0AdwABQLcABYC3AAnAtwAOALcAEoC3ADCAtwA5QLcAPYC3AAHA9wAGAPcACoD3AA7A9wATAPcAF0D3ABuA9wAgAPcAKID3ACzA9wAxQPcANYD3ADnA9wA+APcAAkE3AAbBNwALATcAD0E3ABOBNwAYATsAN/77ADw++wAAvzsABP87AAl/OwAa//sAH3/7ACO/+wAoP/sALH/7ADD/+wA1P/sAOb/7AD3/+wACQDsABoA7AAsAOwAPQDsAE8A7ABgAOwAcgDsAIMA7ACVAOwApgDsALcA7ADJAOwA2gDsAOwA7AD9AOwADwHsACAB7AAyAewAQwHsAFUB7ACJAewAmwHsAKwB7AC+AewAzwHsAOEB7ADyAewABALsABUC7AAmAuwAOALsAEkC7ACyAuwAxALsANUC7ADnAuwA+ALsAAoD7AAbA+wALQPsAD4D7ABQA+wAYQPsAHMD7ACEA+wAlQPsAKcD7AC4A+wAygPsANsD7ADtA+wA/gPsABAE7AAhBOwAMwTsAEQE7ABWBOwAZwTsAHkE7ACKBOwAvwT8AJ/7/ADU+/wA5vv8APj7/AAJ/PwAG/z8AC38/AB8//wAjf/8AJ///ACx//wAwv/8ANT//ADm//wA9//8AAkA/AAaAPwALAD8AD4A/ABPAPwAYQD8AHMA/ACEAPwAlgD8AKgA/AC5APwAywD8AN0A/ADuAPwAAAH8ABIB/AAjAfwANQH8AEYB/ABYAfwAewH8AI0B/ACfAfwAsAH8AMIB/ADUAfwA5QH8APcB/AAsAvwApwL8ALkC/ADLAvwA3AL8AO4C/AAAA/wAEQP8ACMD/AA1A/wARgP8AFgD/ABqA/wAewP8AI0D/ACeA/wAsAP8AMID/ADTA/wA5QP8APcD/AAIBPwAGgT8ACwE/AA9BPwATwT8AGEE/AByBPwAhAT8AJYEDAGY+wwBu/sMAc37DAHf+wwB8fsMAQP8DAEV/AwBJ/wMAdr8DAGD/wwBlf8MAab/DAG4/wwByv8MAdz/DAHu/wwBAAAMARIADAEkAAwBNgAMAUgADAFaAAwBawAMAX0ADAGPAAwBoQAMAbMADAHFAAwB1wAMAekADAH7AAwBDQEMAR8BDAEwAQwBQgEMAXgBDAGKAQwBnAEMAa4BDAHAAQwB0gEMAeQBDAEZAgwBPQIMAU8CDAFhAgwBcwIMAYUCDAGXAgwBqQIMAbsCDAHMAgwB3gIMAfACDAECAwwBFAMMASYDDAE4AwwBSgMMAVwDDAFuAwwBgAMMAZEDDAGjAwwBtQMMAccDDAHZAwwB6wMMAf0DDAEPBAwBIQQMATMEDAFFBAwBVgQMAWgEDAF6BAwBjAQMAZ4EDAGwBBwBkPscAbT7HAHG+xwB2PscAev7HAH9+xwBD/wcASH8HAEz/BwB1/wcAZz/HAGu/xwBwP8cAdP/HAHl/xwB9/8cAQkAHAEbABwBLQAcAUAAHAFSABwBZAAcAXYAHAGIABwBmwAcAa0AHAG/ABwB0QAcAeMAHAH1ABwBCAEcARoBHAEsARwBPgEcAVABHAFjARwBdQEcAYcBHAGZARwBqwEcAb0BHAHQARwB4gEcAQYCHAEYAhwBKwIcAT0CHAFPAhwBYQIcAXMCHAGFAhwBmAIcAaoCHAG8AhwBzgIcAeACHAHzAhwBBQMcARcDHAEpAxwBOwMcAU0DHAFgAxwBcgMcAYQDHAGWAxwBqAMcAbsDHAHNAxwB3wMcAfEDHAEDBBwBFQQcASgEHAE6BBwBTAQcAV4EHAFwBBwBgwQcAZUEHAGnBBwBuQQsAZr7LAGs+ywBv/ssAdH7LAHk+ywB9vssAQn8LAEb/CwBLvwsAUD8LAFS/CwBZfwsAXf8LAGv/CwBwfwsAaT/LAG2/ywByf8sAdv/LAHu/ywBAAAsARIALAElACwBNwAsAUoALAFcACwBbwAsAYEALAGUACwBpgAsAbkALAHLACwB3gAsAfAALAECASwBFQEsAScBLAE6ASwBTAEsAV8BLAFxASwBhAEsAZYBLAGpASwBuwEsAc4BLAEFAiwBFwIsASoCLAE8AiwBTwIsAWECLAF0AiwBhgIsAZkC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");
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  const ints = new Int16Array(bytes.buffer);
  const N = ints.length / 2;
  const LAT = new Float32Array(N), LON = new Float32Array(N);
  const RAD = Math.PI / 180;
  for (let i = 0; i < N; i++) { LAT[i] = ints[2 * i] / 10 * RAD; LON[i] = ints[2 * i + 1] / 10 * RAD; }
  const cosLat = LAT.map(Math.cos), sinLat = LAT.map(Math.sin);

  const NAIROBI = { lat: -1.29 * RAD, lon: 36.82 * RAD };
  const TILT = 0.32;                         // camera looks slightly down
  const START = -NAIROBI.lon;                // start with Kenya facing us
  const css = getComputedStyle(document.documentElement);
  const BLUE = css.getPropertyValue("--blue-mark").trim() || "#256fb6";
  const INK = "21,25,31";                    // --ink as rgb

  // each ring: a circle tilted by "tilt", leaning by "lean", precessing at "speed"
  const RINGS = [
    { r: 1.22, tilt: 0.42, lean: 0.55, speed: 0.16, phase: 0.0, width: 5, color: "0,0,0" },
    { r: 1.32, tilt: 0.30, lean: -0.42, speed: -0.11, phase: 1.8, width: 4, color: "37,111,182" },
    { r: 1.12, tilt: 0.85, lean: 0.12, speed: 0.07, phase: 3.1, width: 1.5, color: "120,132,146" },
  ];

  let W = 0, H = 0, dpr = 1, R = 0, cx = 0, cy = 0;
  function resize() {
    const box = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.round(box.width * dpr); H = Math.round(box.height * dpr);
    canvas.width = W; canvas.height = H;
    R = Math.min(W, H) * 0.34; cx = W / 2; cy = H / 2;
  }

  const ct = Math.cos(TILT), st = Math.sin(TILT);
  function project(x, y, z) {               // apply camera tilt around X
    return [x, y * ct - z * st, y * st + z * ct];
  }

  function ringPoints(ring, t) {
    const ca = Math.cos(ring.tilt), sa = Math.sin(ring.tilt);
    const b = ring.phase + t * ring.speed, cb = Math.cos(b), sb = Math.sin(b);
    const cl = Math.cos(ring.lean), sl = Math.sin(ring.lean);
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const u = (i / 120) * Math.PI * 2;
      const x = Math.cos(u), z = Math.sin(u);                 // circle in XZ plane
      const y1 = -z * sa, z1 = z * ca;                         // tilt about X
      const x2 = x * cb + z1 * sb, z2 = -x * sb + z1 * cb;     // precess about Y
      const x3 = x2 * cl - y1 * sl, y3 = x2 * sl + y1 * cl;    // lean about Z
      pts.push(project(x3 * ring.r, y3 * ring.r, z2 * ring.r));
    }
    return pts;
  }

  // draw one half of a ring, batched into a few opacity steps (no bead artefacts)
  function drawRing(pts, ring, front) {
    const steps = [new Path2D(), new Path2D(), new Path2D()];
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1], z = (p[2] + q[2]) / 2;
      if ((z >= 0) !== front) continue;
      const k = Math.min(2, (((z / ring.r) + 1) / 2 * 3) | 0);
      steps[k].moveTo(cx + p[0] * R, cy - p[1] * R);
      steps[k].lineTo(cx + q[0] * R, cy - q[1] * R);
    }
    ctx.lineWidth = ring.width * dpr;
    ctx.lineCap = "round";
    const alpha = front ? [0.6, 0.8, 1] : [0.12, 0.22, 0.32];
    steps.forEach((path, k) => { ctx.strokeStyle = `rgba(${ring.color},${alpha[k]})`; ctx.stroke(path); });
  }

  function frame(time) {
    const t = time / 1000;
    const rot = START + t * 0.12;
    ctx.clearRect(0, 0, W, H);
    const rings = RINGS.map((r) => ringPoints(r, t));

    // back half of rings
    rings.forEach((pts, i) => drawRing(pts, RINGS[i], false));

    // land dots: back hemisphere (seen through the glass), then front
    const size = 1.9 * dpr;
    const back = new Path2D(), buckets = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    for (let i = 0; i < N; i++) {
      const lon = LON[i] + rot;
      const x = cosLat[i] * Math.sin(lon), y = sinLat[i], z = cosLat[i] * Math.cos(lon);
      const yy = y * ct - z * st, zz = y * st + z * ct;
      const sx = cx + x * R, sy = cy - yy * R;
      if (zz < 0) back.rect(sx - size / 3, sy - size / 3, size / 1.5, size / 1.5);
      else buckets[Math.min(3, (zz * 4) | 0)].rect(sx - size / 2, sy - size / 2, size, size);
    }
    ctx.fillStyle = `rgba(${INK},0.10)`; ctx.fill(back);

    // glass sphere
    const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    g.addColorStop(0, "rgba(255,255,255,0.75)");
    g.addColorStop(0.7, "rgba(241,244,247,0.55)");
    g.addColorStop(1, "rgba(213,219,226,0.65)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 1 * dpr; ctx.strokeStyle = "rgba(124,134,148,0.45)"; ctx.stroke();

    [0.28, 0.48, 0.7, 0.92].forEach((a, k) => { ctx.fillStyle = `rgba(${INK},${a})`; ctx.fill(buckets[k]); });

    // Nairobi marker
    {
      const lon = NAIROBI.lon + rot;
      const x = Math.cos(NAIROBI.lat) * Math.sin(lon), y = Math.sin(NAIROBI.lat), z = Math.cos(NAIROBI.lat) * Math.cos(lon);
      const [, yy, zz] = project(x, y, z);
      if (zz > 0.05) {
        const sx = cx + x * R, sy = cy - yy * R, a = Math.min(1, zz * 3);
        const pulse = (t % 2.4) / 2.4;
        ctx.strokeStyle = `rgba(37,111,182,${(1 - pulse) * 0.6 * a})`;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath(); ctx.arc(sx, sy, (6 + pulse * 22) * dpr, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = a;
        ctx.fillStyle = BLUE;
        ctx.beginPath(); ctx.arc(sx, sy, 6 * dpr, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(sx, sy, 2.2 * dpr, 0, Math.PI * 2); ctx.fill();
        ctx.font = `600 ${13 * dpr}px "IBM Plex Sans", system-ui, sans-serif`;
        ctx.textBaseline = "middle";
        const label = "Nairobi", lx = sx + 14 * dpr, ly = sy;
        const w = ctx.measureText(label).width;
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillRect(lx - 5 * dpr, ly - 11 * dpr, w + 10 * dpr, 22 * dpr);
        ctx.fillStyle = "#000"; ctx.fillText(label, lx, ly + 0.5 * dpr);
        ctx.globalAlpha = 1;
      }
    }

    // front half of rings
    rings.forEach((pts, i) => drawRing(pts, RINGS[i], true));
  }

  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf = 0, visible = true, t0 = performance.now();
  const loop = (now) => { frame(now - t0); raf = requestAnimationFrame(loop); };
  function start() { if (!raf && visible && !still.matches && !document.hidden) raf = requestAnimationFrame(loop); }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  function render() { stop(); resize(); if (still.matches) frame(4000); else start(); }

  new ResizeObserver(() => { resize(); if (!raf) frame(still.matches ? 4000 : performance.now() - t0); }).observe(canvas);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(canvas);
  }
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  still.addEventListener("change", render);
  document.fonts?.ready.then(() => { if (!raf) frame(4000); });
  render();
})();
