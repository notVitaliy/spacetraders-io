import { SpaceTraders } from './index'

describe('SpaceTraders', () => {
  const username = `jest-test-user-${Math.random()}`

  let spaceTraders: SpaceTraders

  beforeAll(() => {
    spaceTraders = new SpaceTraders()
  })

  it('should create a new user', async () => {
    const token = await spaceTraders.init(username)

    expect(token).toBeDefined()
  })
})
