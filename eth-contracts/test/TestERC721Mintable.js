const truffleAssert = require('truffle-assertions');
const RealStateMarketPlaceToken = artifacts.require('RealStateMarketPlaceToken');

contract('TestERC721Mintable', accounts => {

  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[2];
  const NumberOfTokensToMint = 10;

  describe('match erc721 spec', () => {
    var contract;
    beforeEach(async () => {
      contract = await RealStateMarketPlaceToken.new({
        from: account_one
      });

      // mint multiple tokens
      for (let i = 1; i <= NumberOfTokensToMint; i++) {
        await contract.mint(account_one, i);
      }
    })

    it('should return total supply', async () => {
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply, NumberOfTokensToMint, "Number of tokens minted do not match.");
    })

    it('should get token balance', async() => {
      const balance = await contract.balanceOf(account_one);
      assert.equal(balance, NumberOfTokensToMint, "Wrong token balance.");
    })

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it('should return token uri', async() => {
      const expectedTokenUri = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1';
      const tokenUri = await contract.tokenURI(1);
      assert.equal(tokenUri, expectedTokenUri, "No the expected uri.");
    })

    it('should transfer token from one owner to another', async() => {
      await contract.transferFrom(account_one, account_two, 1);
      const ownerAfterTransfer = await contract.ownerOf(1)
      assert.equal(account_two, ownerAfterTransfer, "Wrong owner after transfer.");
    })
  });

  describe('have ownership properties', () => {
    var contract;
    beforeEach(async () => {
      contract = await RealStateMarketPlaceToken.new({
        from: account_one
      });
    })

    it('should fail when minting when address is not contract owner', async() => {
      await truffleAssert.reverts(
        contract.mint(account_two, 11, {
          from: account_two
        }),
        "Caller must match the owner of the contract."
      );
    })

    it('should return contract owner', async() => {
      const owner = await contract.owner();
      assert.equal(account_one, owner, "Invalid contract owner.");
    })
  });

  describe('transferOwnership', () => {
    var contract;
    beforeEach(async function () {
      contract = await RealStateMarketPlaceToken.new({
        from: account_one
      });
      await contract.mint(account_one, 1);
    })

    describe('reverts', () => {
      it('when caller address is not contract owner', async () => {
        await truffleAssert.reverts(
          contract.transferOwnership(account_two, {
            from: account_two
          }),
          "Caller must match the owner of the contract."
        );
      })
      it('when the new owner address is empty', async () => {
        await truffleAssert.reverts(
          contract.transferOwnership('0x0000000000000000000000000000000000000000', {
            from: account_one
          }),
          "newOwner must be a valid address."
        );
      })
    })
    describe('the transfer ownership works', () => {
      it('when the owner is the caller', async() => {
        await contract.transferOwnership(account_two, {
          from: account_one
        });
        const ownerAfterTransfer = await contract.owner()
        assert.equal(account_two, ownerAfterTransfer, "Wrong owner of contract.");
      })
      it('OwnershipTransferred event is fired with right parameters', async() => {
        const tx = await contract.transferOwnership(account_two, {
          from: account_one
        });
        truffleAssert.eventEmitted(tx, 'OwnershipTransferred', (ev) => {
          return ev.prevOwner === account_one && ev.newOwner === account_two;
        });
      })
    })
  })

  describe('Pausable', () => {
    var contract;
    beforeEach(async () => {
      contract = await RealStateMarketPlaceToken.new({
        from: account_one
      });
    })

    describe('togglePaused', () => {
      describe('reverts', () => {
        it('when caller address is not contract owner', async () => {
          await truffleAssert.reverts(
            contract.togglePaused(true, {
              from: account_two
            }),
            "Caller must match the owner of the contract."
          );
        })
      });
      describe('when called to pause', () => {
        it('changes status', async () => {
          await contract.togglePaused(true, {
            from: account_one
          });
          const paused = await contract.paused();
          assert.equal(paused, true, "The contract should be paused.");
        })
        it('emits the expected event', async () => {
          const tx = await contract.togglePaused(true, {
            from: account_one
          });
          truffleAssert.eventEmitted(tx, 'Paused', (ev) => {
            return ev.caller === account_one;
          });
        })
      });
      describe('when called to unpause', () => {
        beforeEach(async () => {
          await contract.togglePaused(true, {
            from: account_one
          });
        });
        it('changes status', async () => {
          await contract.togglePaused(false, {
            from: account_one
          });
          const paused = await contract.paused();
          assert.equal(paused, false, "The contract should not be paused.");
        })
        it('emits the expected event', async () => {
          const tx = await contract.togglePaused(false, {
            from: account_one
          });
          truffleAssert.eventEmitted(tx, 'Unpaused', (ev) => {
            return ev.caller === account_one;
          });
        })
      });
    });
  })


  describe('ERC721', () => {
    var contract;
    beforeEach(async () => {
      contract = await RealStateMarketPlaceToken.new({
        from: account_one
      });
      await contract.mint(account_one, 1);
    })
    describe('approve', async() => {
      describe('reverts', () => {
        it('when token is not minted', async () => {
          await truffleAssert.reverts(
            contract.approve(account_two, 2, {
              from: account_one
            }),
            "Token is not registered."
          );
        })
        it('when caller address is not contract owner', async () => {
          await truffleAssert.reverts(
            contract.approve(account_one, 1, {
              from: account_one
            }),
            "to is already owner of the specified token"
          );
        })
        it('when caller is not owner and the flag approveforall is not set', async () => {
          await truffleAssert.reverts(
            contract.approve(account_three, 1, {
              from: account_two
            }),
            "The caller is not the owner of the contract and the approve for all flag is not set."
          );
        })
      });
      describe('works', () => {
        describe('when caller address is the contract owner', () => {
          it('it gets approved', async () => {
            await contract.approve(account_two, 1, {
              from: account_one
            });
            const approvedAddress = await contract.getApproved(1);
            assert.equal(approvedAddress, account_two, "Wrong approved address.");
          })
          it('emits expected event', async () => {
            const tx = await contract.approve(account_two, 1, {
              from: account_one
            });
            truffleAssert.eventEmitted(tx, 'Approval', (ev) => {
              return ev.owner === account_one && ev.approved === account_two && ev.tokenId.toString() === "1";
            });
          })
        })
        describe('when caller address is the not the contract owner but the approveForall flag is set', () => {
          beforeEach(async () => {
            await contract.setApprovalForAll(account_two, true, {
              from: account_one
            });
          });
          it('it gets approved', async () => {
            await contract.approve(account_three, 1, {
              from: account_two
            });
            const approvedAddress = await contract.getApproved(1);
            assert.equal(approvedAddress, account_three, "Wrong approved address.");
          })
          it('emits expected event', async () => {
            const tx = await contract.approve(account_two, 1, {
              from: account_one
            });
            truffleAssert.eventEmitted(tx, 'Approval', (ev) => {
              return ev.owner === account_one && ev.approved === account_two && ev.tokenId.toString() === "1";
            });
          })
        })
      });
    });
  })
})