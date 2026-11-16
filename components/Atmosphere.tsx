/** Fixed Aurora background: drifting blurred lights plus film grain. Pure CSS, see globals.css. */
export function Atmosphere() {
  return (
    <div aria-hidden className="atmosphere">
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
      <span className="grain" />
    </div>
  );
}
