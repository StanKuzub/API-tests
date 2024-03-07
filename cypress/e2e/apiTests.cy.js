describe('API test suit', () => {
  it('Get all posts', () => {
    cy.request(`http://localhost:3000/posts`).then(response => {
      expect(response.status).to.be.equal(200);
  })
})

  it('Get first 10 posts', () => {
    cy.request(`http://localhost:3000/posts?_limit=10`).then(response => {
      expect(response.status).to.be.equal(200);
      expect(response.body).to.have.lengthOf.at.most(10);
  })
})

it('Retrieve posts and verify IDs', () => {
  const postIds = [55, 60];

  cy.request('http://localhost:3000/posts').then((response) => {
          expect(response.status).to.equal(200);

          const posts = response.body;
          postIds.forEach((postId) => {
              const post = posts.find((p) => p.id === postId);
              expect(post).to.not.be.undefined;
              expect(post.id).to.equal(postId);
          })
      })
    })

      it('Create a post and verify HTTP response status code', () => {
        const postData = {
          userId: 664,
          title: 'This is a post title',
          body: 'This is a test body'
        };
    
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/posts',
          body: postData,
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.equal(201);
        });
      });
      it('Create a post with access token and verify HTTP response status code', () => {
        const accessToken = 'your_access_token_here';
        const postData = {
          userId: 664,
          title: 'This is a post title with access token',
          body: 'This is a test body with access token'
        };
    
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/posts',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: postData
        }).then(response => {
          expect(response.status).to.equal(201);
        });
      });

      it('Create a post entity and verify HTTP response status code', () => {
        const postData = {
          userId: 664,
          title: 'New Post Title',
          body: 'This is the body of the new post.'
        };
    
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/posts',
          body: postData,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          expect(response.status).to.equal(201);
    
          const createdPostId = response.body.id;
    
          cy.request(`http://localhost:3000/posts/${createdPostId}`).then(getResponse => {
            expect(getResponse.status).to.equal(200);
            expect(getResponse.body.userId).to.equal(postData.userId);
            expect(getResponse.body.title).to.equal(postData.title);
            expect(getResponse.body.body).to.equal(postData.body);
          });
        });
      });

      it('Update non-existing entity and verify HTTP response status code', () => {
        const updateData = {
          userId: 664,
          title: 'Updated Post Title',
          body: 'This is the updated body of the post.'
        };
    
        cy.request({
          method: 'PUT',
          url: 'http://localhost:3000/posts/0000',
          body: updateData,
          headers: {
            'Content-Type': 'application/json'
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.equal(404);
        });
      });

      it('Create post entity and update the created entity', () => {
        const newPostData = {
          userId: 611,
          title: 'New Post Title',
          body: 'New post body content'
        };
    
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/posts',
          body: newPostData,
          failOnStatusCode: false
        }).then((postResponse) => {
          expect(postResponse.status).to.equal(201);
    
          const postId = postResponse.body.id;
    
          const updatedPostData = {
            userId: 611,
            title: 'Updated Post Title',
            body: 'Updated post body content'
          };
    
          cy.request({
            method: 'PUT',
            url: `http://localhost:3000/posts/${postId}`,
            body: updatedPostData,
            failOnStatusCode: false
          }).then((updateResponse) => {
            expect(updateResponse.status).to.equal(200);
            expect(updateResponse.body.id).to.equal(postId);
            expect(updateResponse.body.title).to.equal(updatedPostData.title);
            expect(updateResponse.body.body).to.equal(updatedPostData.body);
          });
        });
      });

      it('Delete non-existing post entity', () => {
        const nonExistingPostId = 9999; 
    
        cy.request({
          method: 'DELETE',
          url: `http://localhost:3000/posts/${nonExistingPostId}`,
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.equal(404);
        });
      });

      it('Create post entity, update the created entity, and delete the entity', () => {
        const newPostData = {
          userId: 664,
          title: 'New Post Title',
          body: 'New post body content'
        };
    
        let postId;
    
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/posts',
          body: newPostData,
          failOnStatusCode: false
        }).then((postResponse) => {
          expect(postResponse.status).to.equal(201);
    
          postId = postResponse.body.id;
    
          const updatedPostData = {
            userId: 664,
            title: 'Updated Post Title',
            body: 'Updated post body content'
          };
    
          cy.request({
            method: 'PUT',
            url: `http://localhost:3000/posts/${postId}`,
            body: updatedPostData,
            failOnStatusCode: false
          }).then((updateResponse) => {
            expect(updateResponse.status).to.equal(200);
            expect(updateResponse.body.id).to.equal(postId);
            expect(updateResponse.body.title).to.equal(updatedPostData.title);
            expect(updateResponse.body.body).to.equal(updatedPostData.body);
    
            cy.request({
              method: 'DELETE',
              url: `http://localhost:3000/posts/${postId}`,
              failOnStatusCode: false
            }).then((deleteResponse) => {
              expect(deleteResponse.status).to.equal(200);
    
              cy.request({
                method: 'GET',
                url: `http://localhost:3000/posts/${postId}`,
                failOnStatusCode: false
              }).then((getResponse) => {
                expect(getResponse.status).to.equal(404);
              });
            });
          });
        });
      });
})