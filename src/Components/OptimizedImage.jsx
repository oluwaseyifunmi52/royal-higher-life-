import { webpFor } from "./imageUtils";

export default function OptimizedImage({
  src,
  webp,
  alt = "",
  width,
  height,
  loading = "lazy",
  decoding = "async",
  sizes,
  className = "",
  style,
  onError,
  onLoad,
  priority = false,
  fetchPriority,
  ...rest
}) {
  const imgLoading = priority ? "eager" : loading;
  const fp = fetchPriority || (priority ? "high" : undefined);
  const resolvedWebp = webp || (src ? webpFor(src) : undefined);

  return (
    <picture>
      {resolvedWebp && resolvedWebp !== src && (
        <source srcSet={resolvedWebp} type="image/webp" />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={imgLoading}
        decoding={decoding}
        sizes={sizes}
        className={className}
        style={style}
        fetchPriority={fp}
        onError={onError}
        onLoad={onLoad}
        {...rest}
      />
    </picture>
  );
}
