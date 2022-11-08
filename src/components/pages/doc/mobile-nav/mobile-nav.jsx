import clsx from 'clsx';
import { motion, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';

import Item from 'components/pages/doc/sidebar/item';
import Container from 'components/shared/container';
import ChevronRight from 'icons/chevron-right.inline.svg';

const ANIMATION_DURATION = 0.2;

const variants = {
  from: {
    opacity: 0,
    translateY: 10,
    transition: {
      duration: ANIMATION_DURATION,
    },
    transitionEnd: {
      zIndex: -1,
    },
  },
  to: {
    zIndex: 20,
    opacity: 1,
    translateY: 0,
    transition: {
      duration: ANIMATION_DURATION,
    },
  },
};

const MobileNav = ({ className, sidebar, currentSlug }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { height } = useWindowSize();
  const controls = useAnimation();
  const activeItemIndex = sidebar.findIndex(({ slug, items }) => {
    if (slug) {
      return slug === currentSlug;
    }

    return (
      items?.find(
        ({ slug, items }) => slug === currentSlug || items?.find(({ slug }) => slug === currentSlug)
      ) !== undefined
    );
  });

  const onClickHandler = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      controls.start('to');
    } else {
      document.body.style.overflow = '';
      controls.start('from');
    }
  }, [controls, isOpen]);
  return (
    <nav className={clsx('safe-paddings relative border-b border-gray-7 bg-gray-9', className)}>
      <Container size="lg">
        <button
          className="relative z-10 flex w-full cursor-pointer appearance-none justify-start text-ellipsis bg-transparent py-2.5 outline-none"
          type="button"
          onClick={onClickHandler}
        >
          Documentation menu
        </button>
        <ChevronRight
          className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 md:right-5"
          aria-hidden
        />
      </Container>

      <motion.ul
        className={clsx(
          'fixed inset-x-0 top-[148px] bottom-0 z-20 overflow-y-scroll bg-white px-4 pt-2 pb-4'
        )}
        initial="from"
        animate={controls}
        variants={variants}
        style={{ maxHeight: `${height - 148}px` }}
      >
        {sidebar.map((item, index) => (
          <Item
            {...item}
            isOpenByDefault={index === activeItemIndex}
            currentSlug={currentSlug}
            key={index}
          />
        ))}
      </motion.ul>
    </nav>
  );
};

MobileNav.propTypes = {
  className: PropTypes.string,
  sidebar: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      isStandalone: PropTypes.bool,
      slug: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.exact({
          title: PropTypes.string.isRequired,
          slug: PropTypes.string,
          items: PropTypes.arrayOf(
            PropTypes.exact({
              title: PropTypes.string.isRequired,
              slug: PropTypes.string,
              items: PropTypes.arrayOf(
                PropTypes.exact({
                  title: PropTypes.string,
                  slug: PropTypes.string,
                })
              ),
            })
          ),
        })
      ),
    })
  ).isRequired,
  currentSlug: PropTypes.string.isRequired,
};

MobileNav.defaultProps = {
  className: null,
};

export default MobileNav;
