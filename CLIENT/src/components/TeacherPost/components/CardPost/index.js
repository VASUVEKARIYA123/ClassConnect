import React from 'react';

// ICONS
import { IoMdLink } from 'react-icons/io'

// IMPORTING STYLES
import { Wrapper , Header , Avatar , Informations, PostOwner
       , DateOfPost , Description, ButtonCopyLink } from './styles'

// COMPONENTS
import Comments from '../Comments'
import InputComment from '../InputComment'


export default ({data}) => {

  const comments = data.comments;
  // console.log(data.facultiesId[0].firstname);
  return (
    <>
    <Wrapper>
      <Header>
        <Avatar src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s40-c-fbw=1/photo.jpg" />
        <Informations>
          
          <PostOwner>{data.facultiesId[0].firstname+" "+data.facultiesId[0].lastname}</PostOwner>
          <DateOfPost>{data.posted_date}</DateOfPost>
        </Informations>

        <ButtonCopyLink>
          <IoMdLink size={25} color="#4e4e4e" />
        </ButtonCopyLink>
      </Header>

      <Description> {data.description}  </Description>

      {/* {comments.map( (item) => <Comments key={item.id_comment} data={item} /> )} */}

      {/* <Comments />
      <Comments />
      <Comments /> */}

      {/* <InputComment/> */}
    </Wrapper>
    </>
  );
}
