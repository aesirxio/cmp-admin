/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import './index.scss';
import { Image } from '../Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const NoData = ({
  icons,
  text,
  title,
  link,
  linlText,
  isBtn,
  width,
  className,
  iconColor,
  iconBg,
}: any) => {
  return (
    <div
      className={
        className
          ? className
          : 'text-center h-100 d-flex flex-column justify-content-center align-items-center'
      }
    >
      <div className={`mb-2 d-inline-block position-relative rounded-circle ${iconBg}`}>
        <Image className={`${iconColor}`} src={icons} alt={icons} />
      </div>
      <h5>{title}</h5>
      {text && <p className={`my-2 fs-14 text-body w-100 mx-auto ${width}`}>{text}</p>}

      {isBtn && (
        <Link
          to={{ pathname: link, state: { openModal: true } }}
          className="btn btn-success d-inline-block w-fit"
        >
          <i className="text-white me-2">
            <FontAwesomeIcon icon={faPlus} />
          </i>
          {linlText}
        </Link>
      )}
    </div>
  );
};

export { NoData };
