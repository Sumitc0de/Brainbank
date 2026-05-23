import { motion } from 'framer-motion';

const VARIANTS = {
  primary:   'bg-gradient-to-r from-purple to-purple-soft text-white shadow-lg shadow-purple/20 hover:shadow-purple/30',
  secondary: 'bg-white/60 text-fg border border-edge hover:bg-surface-3/70',
  ghost:     'text-fg-2 hover:text-fg hover:bg-white/60',
  danger:    'bg-red/10 text-red border border-red/20 hover:bg-red/15',
  success:   'bg-green/10 text-green border border-green/20 hover:bg-green/15',
  cyan:      'bg-gradient-to-r from-blue to-cyan text-fg shadow-lg shadow-cyan/25',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export default function Button({
  children, variant = 'primary', size = 'md', className = '',
  disabled, onClick, icon: Icon, type = 'button', ...rest
}) {
  return (
    <motion.button
      type={type}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center font-semibold rounded-xl
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...rest}
    >
      {Icon && <Icon size={size === 'sm' ? 13 : 15} />}
      {children}
    </motion.button>
  );
}
