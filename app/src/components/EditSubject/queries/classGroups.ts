import { gql } from '@apollo/client';

const EDIT_SUBJECT_CLASS_GROUPS_QUERY = gql`
  query EditSubjectClassGroupsQuery(
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    classGroups(before: $before, after: $after, first: $first, last: $last) {
      edges {
        node {
          id
          section
          year
          teacher {
            id
            firstname
            lastname
          }
        }
        cursor
      }
      totalCount
    }
  }
`;

export default EDIT_SUBJECT_CLASS_GROUPS_QUERY;
