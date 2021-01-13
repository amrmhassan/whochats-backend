import jwt from 'jsonwebtoken';
const jjj =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZGFhODRlYjk2N2VlMmRjY2U1N2M5MCIsImlhdCI6MTYwODE2NjQwOX0.x573O7J08B_VCV3xD4X26gMrpELAOHMv7cHpG_59XL0';
console.log(new Date(jwt.decode(jjj).iat).getFullYear());
